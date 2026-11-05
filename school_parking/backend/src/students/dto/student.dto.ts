import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class CreateStudentDto {
  @IsString()
  @Matches(/^[A-Za-z0-9-]{3,30}$/)
  id!: string

  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  className!: string

  @IsString()
  @IsNotEmpty()
  program!: string

  @IsString()
  @Matches(/^[0-9+().\-\s]{8,20}$/)
  phone!: string

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  permitUntil!: string

  @IsString()
  @IsNotEmpty()
  status!: string
}

export class UpdateStudentDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  className!: string

  @IsString()
  @IsNotEmpty()
  program!: string

  @IsString()
  @Matches(/^[0-9+().\-\s]{8,20}$/)
  phone!: string

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  permitUntil!: string

  @IsString()
  @IsNotEmpty()
  status!: string
}
