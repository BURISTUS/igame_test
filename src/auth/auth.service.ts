import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'libs/config/src';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import * as moment from 'moment';
import { LoginUserDto, RegisterUserDto } from './dto';
import { JwtPayload } from './interfaces';
import { IAuthResponse } from './types';
import * as argon from 'argon2';
import { IOKResponse } from 'libs/types/src';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly walletService: WalletService,
    ) {}

    async login(loginUserDto: LoginUserDto): Promise<IAuthResponse> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: loginUserDto.email,
            },
        });

        if (!user) throw new ForbiddenException('Credentials incorrect');

        const arePasswordMatches = await argon.verify(
            user.hash,
            loginUserDto.password,
        );

        if (!arePasswordMatches)
            throw new ForbiddenException('Credentials incorrect');

        const accessToken = await this.generateAccessToken({
            id: user.id,
            email: user.email,
        });
        const refreshToken = await this.generateRefreshToken({
            id: user.id,
            email: user.email,
        });

        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                refreshToken,
                refreshTokenExpiresDate: moment().add(6, 'hours').toDate(),
            },
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async register(registerUserDto: RegisterUserDto): Promise<IAuthResponse> {
        const userData = registerUserDto;
        userData.hash = await argon.hash(userData.hash);

        const user = await this.prisma.user.create({
            data: {
                ...userData,
            },
        });

        const wallet = await this.walletService.create(user.id);

        if (!wallet) {
            throw new ForbiddenException("Can't create wallet");
        }

        const accessToken = await this.generateAccessToken({
            id: user.id,
            email: user.email,
        });
        const refreshToken = await this.generateRefreshToken({
            id: user.id,
            email: user.email,
        });

        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                refreshToken,
                refreshTokenExpiresDate: moment().add(6, 'hours').toDate(),
            },
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async generateAccessToken(payload: JwtPayload): Promise<string> {
        return this.jwtService.sign(payload);
    }

    async generateRefreshToken(payload: JwtPayload): Promise<string> {
        const refreshToken = await this.jwtService.sign(payload, {
            secret: jwtConfig.secret,
            expiresIn: jwtConfig.refreshExpiresIn,
        });

        return refreshToken;
    }

    async createAccessTokenFromRefreshToken(
        refreshToken: string,
    ): Promise<IAuthResponse> {
        const user = await this.resolveRefreshToken(refreshToken);

        const accessToken = await this.generateAccessToken({
            id: user.id,
            email: user.email,
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async resolveRefreshToken(refreshToken: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                refreshToken,
            },
        });

        if (!user) {
            throw new ForbiddenException({
                message: 'refresh token malformed',
            });
        }

        if (moment().isAfter(moment(user.refreshTokenExpiresDate))) {
            throw new ForbiddenException({
                menubar: 'Refresh token revoked',
            });
        }

        return user;
    }

    async logout(userId: number): Promise<IOKResponse> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException({
                message: 'user not found',
                statusCode: 404,
            });
        }

        user.refreshToken = null;
        user.refreshTokenExpiresDate = null;

        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                ...user,
            },
        });

        return {
            message: 'ok',
        };
    }
}
