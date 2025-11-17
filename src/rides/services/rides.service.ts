import { 
  BadRequestException, 
  Injectable, 
  NotFoundException,
  ForbiddenException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ride, RideDocument } from '../schemas/ride.schema';
import { CreateRideDto } from '../dto/create-ride.dto';

function toObjectId(idLike: any): Types.ObjectId {
  const value = typeof idLike === 'string' 
    ? idLike 
    : (idLike?.id ?? idLike?._id ?? idLike?.sub ?? idLike);
  if (!value) throw new BadRequestException('ID de usuario faltante');
  return new Types.ObjectId(String(value));
}

@Injectable()
export class RidesService {
  constructor(
    @InjectModel(Ride.name) private readonly rideModel: Model<RideDocument>
  ) {}

  /**
   * Crear un nuevo ride (solo conductores)
   */
  async create(user: any, dto: CreateRideDto) {
    const userId = toObjectId(user);
    
    const ride = await this.rideModel.create({
      origin: dto.origin,
      destination: dto.destination,
      date: dto.date,
      time: dto.time,
      price: dto.price,
      seats: dto.seats ?? 1,
      availableSeats: dto.seats ?? 1,
      description: dto.description,
      status: 'pending',
      createdBy: userId,
      passengers: [],
    });

    return ride.toObject();
  }

  /**
   * Listar todos los rides disponibles (con cupos)
   */
  async findAll() {
    return this.rideModel
      .find({ status: 'pending', availableSeats: { $gt: 0 } })
      .populate('createdBy', 'name email')
      .populate('passengers', 'name email')
      .sort({ date: 1, time: 1, createdAt: -1 }) // Ordenar por fecha y hora
      .lean()
      .exec();
  }

  /**
   * Obtener un ride por ID
   */
  async findOne(rideId: string) {
    const ride = await this.rideModel
      .findById(rideId)
      .populate('createdBy', 'name email')
      .populate('passengers', 'name email')
      .lean()
      .exec();

    if (!ride) {
      throw new NotFoundException('Ride no encontrado');
    }

    return ride;
  }

  /**
   * Mis rides como conductor
   */
  async findMyRides(user: any) {
    const userId = toObjectId(user);
    return this.rideModel
      .find({ createdBy: userId })
      .populate('passengers', 'name email')
      .sort({ date: 1, time: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  /**
   * Rides donde soy pasajero
   */
  async findMyBookings(user: any) {
    const userId = toObjectId(user);
    return this.rideModel
      .find({ passengers: userId })
      .populate('createdBy', 'name email')
      .populate('passengers', 'name email')
      .sort({ date: 1, time: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  /**
   * Iniciar un ride (cambiar estado a accepted)
   */
  async startRide(rideId: string, user: any) {
    const userId = toObjectId(user);
    const ride = await this.rideModel.findById(rideId);

    if (!ride) {
      throw new NotFoundException('Ride no encontrado');
    }

    if (ride.createdBy.toString() !== userId.toString()) {
      throw new ForbiddenException('Solo el conductor puede iniciar el ride');
    }

    if (ride.status !== 'pending') {
      throw new BadRequestException('Este ride ya fue iniciado o completado');
    }

    ride.status = 'accepted';
    await ride.save();
    
    const updated = await this.rideModel
      .findById(ride._id)
      .populate('createdBy', 'name email')
      .populate('passengers', 'name email')
      .lean()
      .exec();
      
    return updated;
  }

  /**
   * Reservar cupo(s) en un ride (pasajeros)
   */
  async bookRide(rideId: string, user: any, seats: number = 1) {
    if (!rideId) throw new BadRequestException('ID de ride requerido');
    
    const userId = toObjectId(user);
    const ride = await this.rideModel.findById(rideId);

    if (!ride) {
      throw new NotFoundException('Ride no encontrado');
    }

    // Validaciones
    if (ride.createdBy.toString() === userId.toString()) {
      throw new ForbiddenException('No puedes reservar tu propio ride');
    }

    if (ride.status !== 'pending') {
      throw new BadRequestException('Este ride no está disponible');
    }

    // Validar que haya suficientes cupos disponibles
    if (ride.availableSeats < seats) {
      throw new BadRequestException(
        `Solo hay ${ride.availableSeats} cupo(s) disponible(s). Solicitaste ${seats}.`
      );
    }

    if (ride.passengers.some(p => p.toString() === userId.toString())) {
      throw new BadRequestException('Ya has reservado este ride');
    }

    // Agregar pasajero y reducir cupos disponibles según la cantidad solicitada
    ride.passengers.push(userId);
    ride.availableSeats -= seats;

    // Si se llenaron todos los cupos, cambiar estado a accepted
    if (ride.availableSeats === 0) {
      ride.status = 'accepted';
    }

    await ride.save();
    
    // Retornar con datos poblados
    const updated = await this.rideModel
      .findById(ride._id)
      .populate('createdBy', 'name email')
      .populate('passengers', 'name email')
      .lean()
      .exec();
      
    return updated;
  }

  /**
   * Cancelar una reserva (pasajeros)
   */
  async cancelBooking(rideId: string, user: any) {
    const userId = toObjectId(user);
    const ride = await this.rideModel.findById(rideId);

    if (!ride) {
      throw new NotFoundException('Ride no encontrado');
    }

    const passengerIndex = ride.passengers.findIndex(
      p => p.toString() === userId.toString()
    );

    if (passengerIndex === -1) {
      throw new BadRequestException('No tienes una reserva en este ride');
    }

    // Remover pasajero y aumentar cupos disponibles
    ride.passengers.splice(passengerIndex, 1);
    ride.availableSeats += 1;

    // Si estaba lleno y ahora hay cupos, volver a pending
    if (ride.status === 'accepted' && ride.availableSeats > 0) {
      ride.status = 'pending';
    }

    await ride.save();
    
    const updated = await this.rideModel
      .findById(ride._id)
      .populate('createdBy', 'name email')
      .populate('passengers', 'name email')
      .lean()
      .exec();
      
    return updated;
  }

  /**
   * Completar un ride (solo conductor)
   */
  async completeRide(rideId: string, user: any) {
    const userId = toObjectId(user);
    const ride = await this.rideModel.findById(rideId);

    if (!ride) {
      throw new NotFoundException('Ride no encontrado');
    }

    if (ride.createdBy.toString() !== userId.toString()) {
      throw new ForbiddenException('Solo el conductor puede completar el ride');
    }

    ride.status = 'completed';
    await ride.save();
    
    const updated = await this.rideModel
      .findById(ride._id)
      .populate('createdBy', 'name email')
      .populate('passengers', 'name email')
      .lean()
      .exec();
      
    return updated;
  }

  /**
   * Cancelar un ride (cambiar estado a cancelado)
   * Solo el conductor puede hacerlo
   */
  async cancelRide(rideId: string, user: any) {
    const userId = toObjectId(user);
    const ride = await this.rideModel.findById(rideId);

    if (!ride) {
      throw new NotFoundException('Ride no encontrado');
    }

    if (ride.createdBy.toString() !== userId.toString()) {
      throw new ForbiddenException('Solo el conductor puede cancelar el ride');
    }

    // Solo permitir cancelar rides pendientes o aceptados
    if (ride.status === 'completed' || ride.status === 'canceled') {
      throw new BadRequestException('Este ride ya está completado o cancelado');
    }

    ride.status = 'canceled';
    await ride.save();
    
    const updated = await this.rideModel
      .findById(ride._id)
      .populate('createdBy', 'name email')
      .populate('passengers', 'name email')
      .lean()
      .exec();
      
    return updated;
  }

  /**
   * Eliminar un ride permanentemente de la base de datos
   * Solo el conductor puede hacerlo y solo si está completado o cancelado
   */
  async deleteRide(rideId: string, user: any) {
    const userId = toObjectId(user);
    const ride = await this.rideModel.findById(rideId);

    if (!ride) {
      throw new NotFoundException('Ride no encontrado');
    }

    if (ride.createdBy.toString() !== userId.toString()) {
      throw new ForbiddenException('Solo el conductor puede eliminar el ride');
    }

    // Solo permitir eliminar rides completados o cancelados
    if (ride.status !== 'completed' && ride.status !== 'canceled') {
      throw new BadRequestException('Solo puedes eliminar rides completados o cancelados');
    }

    // Eliminar completamente de la base de datos
    await this.rideModel.findByIdAndDelete(rideId);

    return { message: 'Ride eliminado exitosamente', id: rideId };
  }
}