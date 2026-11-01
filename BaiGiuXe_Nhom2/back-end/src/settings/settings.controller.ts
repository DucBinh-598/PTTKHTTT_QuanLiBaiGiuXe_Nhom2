import { Body, Controller, Get, Put } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from '../auth/auth.decorators'
import { UpdateSettingsDto } from './dto/settings.dto'
import { SettingsService } from './settings.service'

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  find() {
    return this.settings.find()
  }

  @Put()
  @Roles(UserRole.ADMIN)
  update(@Body() dto: UpdateSettingsDto) {
    return this.settings.update(dto)
  }
}
