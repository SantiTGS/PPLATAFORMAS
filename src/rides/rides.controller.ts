// src/rides/rides.controller.ts
import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { RidesService } from './rides.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rides') // 👈 sin 'api/', el prefix lo pone main.ts
export class RidesController {
  constructor(private readonly rides: RidesService) {}

  @Get()
  async all() {
    return this.rides.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async mine(@Request() req: any) {
    return this.rides.findMine(req.user?.sub ?? req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: any, @Request() req: any) {
    return this.rides.create(req.user?.sub ?? req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  async accept(@Param('id') id: string, @Request() req: any) {
    return this.rides.accept(id, req.user?.sub ?? req.user);
  }
}
