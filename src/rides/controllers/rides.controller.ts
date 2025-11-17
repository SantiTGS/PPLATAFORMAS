import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Post, 
  Delete,
  Patch,
  Request, 
  UseGuards,
  ValidationPipe 
} from '@nestjs/common';
import { RidesService } from '../services/rides.service';
import { CreateRideDto } from '../dto/create-ride.dto';
import { BookRideDto } from '../dto/book-ride.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';
import { Role } from '../../common/roles.enum';

@Controller('rides')
@UseGuards(JwtAuthGuard)
export class RidesController {
  constructor(private readonly rides: RidesService) {}

  /**
   * Listar todos los rides disponibles
   */
  @Get()
  async findAll() {
    return this.rides.findAll();
  }

  /**
   * Mis rides como conductor
   * ⚠️ IMPORTANTE: DEBE estar ANTES de @Get(':id')
   */
  @UseGuards(RolesGuard)
  @Roles(Role.Driver, Role.Admin)
  @Get('my-rides')
  async myRides(@Request() req: any) {
    return this.rides.findMyRides(req.user);
  }

  /**
   * Mis reservas como pasajero
   * ⚠️ IMPORTANTE: DEBE estar ANTES de @Get(':id')
   */
  @Get('my-bookings')
  async myBookings(@Request() req: any) {
    return this.rides.findMyBookings(req.user);
  }

  /**
   * Obtener un ride por ID
   * ⚠️ IMPORTANTE: DEBE estar DESPUÉS de rutas específicas
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rides.findOne(id);
  }

  /**
   * Crear un nuevo ride
   */
  @UseGuards(RolesGuard)
  @Roles(Role.Driver, Role.Admin)
  @Post()
  async create(
    @Body(ValidationPipe) dto: CreateRideDto,
    @Request() req: any
  ) {
    return this.rides.create(req.user, dto);
  }

  /**
   * Reservar cupo(s) en un ride
   */
  @Post(':id/book')
  async book(
    @Param('id') id: string, 
    @Body(ValidationPipe) bookRideDto: BookRideDto,
    @Request() req: any
  ) {
    return this.rides.bookRide(id, req.user, bookRideDto.seats);
  }

  /**
   * Cancelar mi reserva en un ride
   */
  @Delete(':id/book')
  async cancelBooking(@Param('id') id: string, @Request() req: any) {
    return this.rides.cancelBooking(id, req.user);
  }

  /**
   * Iniciar un ride
   */
  @UseGuards(RolesGuard)
  @Roles(Role.Driver, Role.Admin)
  @Patch(':id/start')
  async start(@Param('id') id: string, @Request() req: any) {
    return this.rides.startRide(id, req.user);
  }

  /**
   * Completar un ride
   */
  @UseGuards(RolesGuard)
  @Roles(Role.Driver, Role.Admin)
  @Post(':id/complete')
  async complete(@Param('id') id: string, @Request() req: any) {
    return this.rides.completeRide(id, req.user);
  }

  /**
   * Cancelar un ride (cambiar estado a cancelado)
   */
  @UseGuards(RolesGuard)
  @Roles(Role.Driver, Role.Admin)
  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @Request() req: any) {
    return this.rides.cancelRide(id, req.user);
  }

  /**
   * Eliminar un ride permanentemente
   * Solo para rides completados o cancelados
   */
  @UseGuards(RolesGuard)
  @Roles(Role.Driver, Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.rides.deleteRide(id, req.user);
  }
}