import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { HealthController } from './health.controller'
import { MovementsModule } from './movements/movements.module'
import { PrismaModule } from './prisma/prisma.module'
import { SettingsModule } from './settings/settings.module'
import { StudentsModule } from './students/students.module'
import { TicketsModule } from './tickets/tickets.module'
import { VehiclesModule } from './vehicles/vehicles.module'

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DashboardModule,
    MovementsModule,
    SettingsModule,
    StudentsModule,
    TicketsModule,
    VehiclesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
