import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    hash: string;

    @IsOptional()
    @IsString()
    readonly firstName?: string;

    @IsOptional()
    @IsString()
    readonly lastName?: string;
}
