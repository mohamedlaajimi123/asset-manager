import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (_request, _rawJwtToken, done) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
          return done(new UnauthorizedException('JWT_SECRET must be defined'), null);
        }

        return done(null, jwtSecret);
      },
    });
  }

  async validate(payload: { userId: string; email: string; role: string }) {
    if (!payload?.userId || !payload?.email || !payload?.role) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  }
}