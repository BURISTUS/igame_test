import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { Balance } from './interfaces';
import { WalletService } from './wallet.service';

@UseGuards(JwtGuard)
@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Get('get-balance')
    async getBalance(@GetUser('id') userId: number): Promise<Balance> {
        return await this.walletService.getBalance(userId);
    }
}
