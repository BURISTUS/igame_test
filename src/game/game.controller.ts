import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IGame } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from '../auth/decorator';
import { StartGameDto } from './dto/start-game.dto';
import { GameService } from './game.service';
import { GameResult } from './interfaces';

@UseGuards(JwtGuard)
@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post('start-game')
    async startGame(
        @GetUser('id') userId: number,
        @Body() startGameDto: StartGameDto,
    ): Promise<GameResult> {
        return await this.gameService.startGame(userId, startGameDto.amount);
    }

    @Get('get-last-game')
    async getLastGame(@GetUser('id') userId: number): Promise<IGame> {
        return await this.gameService.getLastGame(userId);
    }

    @Get('get-all-games')
    async getAllGames(@GetUser('id') userId: number): Promise<IGame[]> {
        return await this.gameService.getAllGames(userId);
    }
}
