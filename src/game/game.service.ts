import { ForbiddenException, Injectable } from '@nestjs/common';
import { IGame } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';
import { GameResult } from './interfaces';

@Injectable()
export class GameService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly walletService: WalletService,
    ) {}

    async startGame(userId: number, amount: number): Promise<GameResult> {
        const gameResult = this.play();
        const wallet = await this.prismaService.wallet.findUnique({
            where: {
                userId,
            },
        });

        if (wallet.balance < amount) {
            throw new ForbiddenException(
                'You cannot bet more than you have in your account',
            );
        }
        await this.walletService.decreaseBalance(userId, amount);

        await this.prismaService.iGame.create({
            data: {
                userId,
                isWin: gameResult,
            },
        });

        if (gameResult) {
            await this.walletService.increaseBalance(userId, amount * 2);
            return { isWin: true };
        }

        return { isWin: false };
    }

    play(): boolean {
        const randomNumber = Math.floor(Math.random() * 100) + 1;

        if (randomNumber > 50) {
            return true;
        } else {
            return false;
        }
    }

    async getLastGame(userId: number): Promise<IGame> {
        return await this.prismaService.iGame.findFirst({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getAllGames(userId: number): Promise<IGame[]> {
        return await this.prismaService.iGame.findMany({
            where: {
                userId,
            },
        });
    }
}
