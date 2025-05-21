import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload.type';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: (req: Request) => {
                return req?.cookies?.['access_token'];
            },
            ignoreExpiration: true,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        } as any);
    }

    async validate(payload: any): Promise<JwtPayload> {
        return {
            userId: payload.sub,
            username: payload.username,
            role: payload.role
        };
    }
}
