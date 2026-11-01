import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { CreateMovementDto } from './dto/movement.dto'
import { MovementsService } from './movements.service'

@Controller('movements')
export class MovementsController {
  constructor(private readonly movements: MovementsService) {}

  @Get()
  findAll(
    @Query('date') date?: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.movements.findAll(date, search, type)
  }

  @Post()
  create(@Body() dto: CreateMovementDto) {
    return this.movements.create(dto)
  }
}
