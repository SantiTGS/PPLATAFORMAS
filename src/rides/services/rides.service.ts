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
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  /**
   * Mis rides como conductor
   */
  async findMyRides(user: any) {
    const userId = toObjectId(user);
    return this.rideModel
      .find({ createdBy: userId })
      .populate('passengers', 'name email')
      .sort({ createdAt: -1 })
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
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  /**
   * Reservar un cupo en un ride (pasajeros)
   */
  async bookRide(rideId: string, user: any) {
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

    if (ride.availableSeats <= 0) {
      throw new BadRequestException('No hay cupos disponibles');
    }

    if (ride.passengers.some(p => p.toString() === userId.toString())) {
      throw new BadRequestException('Ya has reservado este ride');
    }

    // Agregar pasajero y reducir cupos disponibles
    ride.passengers.push(userId);
    ride.availableSeats -= 1;

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
   * Cancelar un ride (solo conductor)
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
}