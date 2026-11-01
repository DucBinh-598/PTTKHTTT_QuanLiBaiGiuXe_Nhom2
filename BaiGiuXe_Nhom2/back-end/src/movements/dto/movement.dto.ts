import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateMovementDto {
  @IsString()
  @IsNotEmpty()
  vehicleId!: string

  @IsString()
  @IsIn(['Vào bãi', 'Ra bãi'])
  type!: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  gate?: string
}
