import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string

  @IsString()
  @Matches(/^[A-Za-z0-9][A-Za-z0-9 .-]{2,19}$/)
  plate!: string

  @IsString()
  @IsNotEmpty()
  type!: string

  @IsString()
  @IsNotEmpty()
  color!: string
}

export class UpdateVehicleDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string

  @IsString()
  @Matches(/^[A-Za-z0-9][A-Za-z0-9 .-]{2,19}$/)
  plate!: string

  @IsString()
  @IsNotEmpty()
  type!: string

  @IsString()
  @IsNotEmpty()
  color!: string
}
