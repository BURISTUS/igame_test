import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'libs/prisma/src/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { GameModule } from './game/game.module';

@Module({
    imports: [
        AuthModule,
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UserModule,
        WalletModule,
        GameModule,
    ],
})
export class AppModule {}
