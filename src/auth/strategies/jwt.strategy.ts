import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConfig } from 'libs/config/src';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfig.secret,
        });
    }

    async validate(payload: JwtPayload) {
        console.log(payload);
        console.log('test');
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.id,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        delete user.hash;

        return user;
    }
}
