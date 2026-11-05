import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common'
import { IS_PUBLIC_KEY } from './auth.constants'

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export type AuthUser = {
  id: string
  name: string
  email: string
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser =>
    context.switchToHttp().getRequest<{ user: AuthUser }>().user,
)
