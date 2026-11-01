import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from '../auth/auth.decorators'
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto'
import { VehiclesService } from './vehicles.service'

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicles: VehiclesService) {}

  @Get()
  findAll(@Query('search') search?: string, @Query('inParking') inParking?: string) {
    return this.vehicles.findAll(search, inParking)
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateVehicleDto) {
    return this.vehicles.create(dto)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehicles.update(id, dto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.vehicles.remove(id)
  }
}
