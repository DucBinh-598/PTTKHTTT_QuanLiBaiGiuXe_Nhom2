import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLocaleLowerCase('en-US') },
    })
    if (!user || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.')
    }

    return this.createSession(user)
  }

  async register(name: string, email: string, password: string) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLocaleLowerCase('en-US'),
          passwordHash: await hash(password, 12),
        },
      })
      return this.createSession(user)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Địa chỉ email này đã được đăng ký.')
      }
      throw error
    }
  }

  private async createSession(user: { id: string; name: string; email: string }) {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    }
    return {
      accessToken: await this.jwt.signAsync(payload),
      user: payload,
    }
  }
}
