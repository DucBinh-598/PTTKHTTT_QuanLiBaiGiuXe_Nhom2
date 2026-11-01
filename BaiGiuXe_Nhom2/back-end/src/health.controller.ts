import { Controller, Get } from '@nestjs/common'
import { Public } from './auth/auth.decorators'
import { PrismaService } from './prisma/prisma.service'

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  async check() {
    await this.prisma.$queryRaw`SELECT 1`
    return { status: 'ok', database: 'connected' }
  }
}
