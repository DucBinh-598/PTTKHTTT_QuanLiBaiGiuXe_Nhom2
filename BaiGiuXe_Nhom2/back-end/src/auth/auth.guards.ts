import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { UserRole } from '@prisma/client'
import { IS_PUBLIC_KEY, ROLES_KEY } from './auth.constants'
import type { AuthUser } from './auth.decorators'

type TokenPayload = {
  sub: string
  name: string
  email: string
  role: UserRole
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string }
      user?: AuthUser
    }>()
    const [scheme, token] = request.headers.authorization?.split(' ') ?? []
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Vui lòng đăng nhập.')

    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(token)
      request.user = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      }
      return true
    } catch {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.')
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!roles?.length) return true

    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>()
    return Boolean(request.user && roles.includes(request.user.role))
  }
}
