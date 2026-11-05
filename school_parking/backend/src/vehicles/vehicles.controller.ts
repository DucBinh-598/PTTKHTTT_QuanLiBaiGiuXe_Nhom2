import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
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
  create(@Body() dto: CreateVehicleDto) {
    return this.vehicles.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehicles.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicles.remove(id)
  }
}
