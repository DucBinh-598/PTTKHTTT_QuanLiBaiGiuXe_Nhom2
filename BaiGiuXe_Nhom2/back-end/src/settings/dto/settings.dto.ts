import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator'

export class UpdateSettingsDto {
  @IsString()
  @IsNotEmpty()
  schoolName!: string

  @IsString()
  @IsNotEmpty()
  lotName!: string

  @IsInt()
  @Min(1)
  capacity!: number

  @IsString()
  @IsNotEmpty()
  mainGate!: string

  @IsEmail()
  contactEmail!: string
}
