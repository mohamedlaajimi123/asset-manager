import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        password: this.hashPassword(dto.password),
        role: Role.USER,
      },
    });
    
    const payload = { userId: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      accessToken: token,
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || user.password !== this.hashPassword(dto.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      accessToken: token,
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}