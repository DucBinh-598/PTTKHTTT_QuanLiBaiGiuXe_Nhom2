import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(100)
  name!: string

  @IsEmail()
  @MaxLength(254)
  email!: string

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string
}
