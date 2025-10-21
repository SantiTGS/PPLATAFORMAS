import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slots: SlotsService) {}

  @Get()
  all() {
    return this.slots.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.driver)
  @Post()
  create(@Body() dto: CreateSlotDto, @Request() req: any) {
    return this.slots.create(req.user, dto as any);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @Body() body: { name?: string }) {
    const name = body?.name ?? 'Anonymous';
    return this.slots.join(id, name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.driver)
  @Delete(':id/remove/:index')
  removePassenger(@Param('id') id: string, @Param('index') index: string, @Request() req: any) {
    const idx = Number(index);
    return this.slots.removePassenger(id, idx, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.driver)
  @Delete(':id')
  removeSlot(@Param('id') id: string, @Request() req: any) {
    return this.slots.removeSlot(id, req.user);
  }
}
