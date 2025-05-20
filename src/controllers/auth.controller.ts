import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import {AuthService} from "../services/auth.service";

class LoginDto {
    username: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        try {
            const result = await this.authService.login(loginDto.username, loginDto.password);
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
}
