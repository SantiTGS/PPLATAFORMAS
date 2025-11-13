import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Post, 
  Delete,
  Request, 
  UseGuards,
  ValidationPipe 
} from '@nestjs/common';
import { RidesService } from '../services/rides.service';
import { CreateRideDto } from '../dto/create-ride.dto';
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
   * Público para usuarios autenticados
   */
  @Get()
  async findAll() {
    return this.rides.findAll();
  }

  /**
   * Mis rides como conductor
   * Solo conductores y admins
   */
  @UseGuards(RolesGuard)
  @Roles(Role.Driver, Role.Admin)
  @Get('my-rides')
  async myRides(@Request() req: any) {
    return this.rides.findMyRides(req.user);
  }

  /**
   * Mis reservas como pasajero
   * Todos los usuarios autenticados
   */
  @Get('my-bookings')
  async myBookings(@Request() req: any) {
    return this.rides.findMyBookings(req.user);
  }

  /**
   * Crear un nuevo ride
   * Solo conductores y admins
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
   * Reservar un cupo en un ride
   * Todos los usuarios autenticados
   */
  @Post(':id/book')
  async book(@Param('id') id: string, @Request() req: any) {
    return this.rides.bookRide(id, req.user);
  }

  /**
   * Cancelar mi reserva en un ride
   * Todos los usuarios autenticados
   */
  @Delete(':id/book')
  async cancelBooking(@Param('id') id: string, @Request() req: any) {
    return this.rides.cancelBooking(id, req.user);
  }

  /**
   * Completar un ride
   * Solo el conductor que lo creó
   */
  @UseGuards(RolesGuard)
  @Roles(Role.Driver, Role.Admin)
  @Post(':id/complete')
  async complete(@Param('id') id: string, @Request() req: any) {
    return this.rides.completeRide(id, req.user);
  }

  /**
   * Cancelar un ride
   * Solo el conductor que lo creó
   */
  @UseGuards(RolesGuard)
  @Roles(Role.Driver, Role.Admin)
  @Delete(':id')
  async cancel(@Param('id') id: string, @Request() req: any) {
    return this.rides.cancelRide(id, req.user);
  }
}