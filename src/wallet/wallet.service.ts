import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { Balance } from './interfaces';

@Injectable()
export class WalletService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(userId: number) {
        return await this.prismaService.wallet.create({
            data: {
                balance: 10000,
                userId,
            },
        });
    }

    async getBalance(userId: number): Promise<Balance> {
        return this.prismaService.wallet.findUnique({
            where: {
                userId,
            },
        });
    }

    async increaseBalance(userId: number, amount: number): Promise<Balance> {
        return this.prismaService.wallet.update({
            where: {
                userId: userId,
            },
            data: {
                balance: {
                    increment: amount,
                },
            },
        });
    }
    async decreaseBalance(userId: number, amount: number): Promise<Balance> {
        return this.prismaService.wallet.update({
            where: {
                userId: userId,
            },
            data: {
                balance: {
                    decrement: amount,
                },
            },
        });
    }
}
