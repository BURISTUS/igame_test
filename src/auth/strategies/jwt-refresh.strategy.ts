import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConfig } from 'libs/config/src';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
            secret: jwtConfig.secret,
        });
    }

    async validate(payload: JwtPayload) {
        console.log('test');
        console.log(payload);
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
