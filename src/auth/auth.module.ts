import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from 'libs/config/src';
import { WalletService } from 'src/wallet/wallet.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: jwtConfig.secret,
            signOptions: {
                expiresIn: jwtConfig.accessExpiresIn,
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, WalletService],
    exports: [AuthService],
})
export class AuthModule {}
