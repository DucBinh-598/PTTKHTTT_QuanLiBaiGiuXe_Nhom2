import { Controller, Get, Param, Put, Query } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from '../auth/auth.decorators'
import { TicketsService } from './tickets.service'

@Controller('tickets')
@Roles(UserRole.ADMIN)
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}

  @Get()
  findAll(@Query('search') search?: string, @Query('status') status?: string) {
    return this.tickets.findAll(search, status)
  }

  @Put(':studentId/renew')
  renew(@Param('studentId') studentId: string) {
    return this.tickets.renew(studentId)
  }
}
