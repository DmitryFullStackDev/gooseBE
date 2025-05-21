import { Controller, Post, Body, BadRequestException, UnauthorizedException, Res, Get, UseGuards } from '@nestjs/common';
import { AuthService } from "../services/auth.service";
import { Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

class LoginDto {
    username: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response
    ) {
        try {
            const result = await this.authService.login(loginDto.username, loginDto.password, response);
            return result;
        } catch (e) {
            if (e instanceof BadRequestException || e instanceof UnauthorizedException) {
                return {
                    error: e.message,
                };
            }
            throw e;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        return this.authService.logout(response);
    }
}
