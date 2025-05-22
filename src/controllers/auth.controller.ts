import {
    Controller,
    Post,
    Body,
    BadRequestException,
    UnauthorizedException,
    Res,
    Get,
    UseGuards,
    UseInterceptors,
    Request
} from '@nestjs/common';
import { AuthService } from "../services/auth.service";
import { Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {authCookieInterceptor} from "../interceptors/authCookieInterceptor";

class LoginDto {
    username: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(
        @Body() loginDto: LoginDto
    ) {
        return this.authService.login(loginDto.username, loginDto.password);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout() {
        return { message: 'Logout successful' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Request() req) {
        return { user: req.user };
    }
}
