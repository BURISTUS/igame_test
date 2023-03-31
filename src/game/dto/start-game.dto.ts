import { IsNotEmpty, IsNumber } from 'class-validator';

export class StartGameDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}
