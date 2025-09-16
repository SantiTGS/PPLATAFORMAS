import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async register(@Body() dto: CreateUserDto) {
    const user = await this.users.create(dto);
    const { passwordHash, ...safe } = user;
    return safe;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  all() {
    return this.users.findAll();
  }
}
