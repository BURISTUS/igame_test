import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { IAuthResponse } from './types';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto): Promise<IAuthResponse> {
        return await this.authService.login(loginUserDto);
    }

    @Post('register')
    async register(
        @Body() registerUserDto: RegisterUserDto,
    ): Promise<IAuthResponse> {
        return await this.authService.register(registerUserDto);
    }

    @Post('refresh')
    async refresh(@Body() refreshToken: string): Promise<IAuthResponse> {
        return await this.authService.createAccessTokenFromRefreshToken(
            refreshToken,
        );
    }
}
