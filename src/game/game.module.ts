import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { WalletService } from 'src/wallet/wallet.service';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
    imports: [WalletModule],
    providers: [GameService, WalletService],
    controllers: [GameController],
})
export class GameModule {}
