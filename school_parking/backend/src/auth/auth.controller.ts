import { Body, Controller, Get, Post } from '@nestjs/common'
import { Public, CurrentUser, type AuthUser } from './auth.decorators'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password)
  }

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.name, dto.email, dto.password)
  }

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return user
  }
}
