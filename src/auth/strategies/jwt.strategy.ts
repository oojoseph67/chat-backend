import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { CookieKey } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtStrategy') {
  constructor(configService: ConfigService) {
    super({
      // jwtFromRequest: (req) => req.headers['authorization'].split(' ')[1],
      // secretOrKey: process.env.JWT_SECRET,

      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies[CookieKey],
      ]),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    console.log('jwt strategy', { payload });

    return payload;
  }
}
