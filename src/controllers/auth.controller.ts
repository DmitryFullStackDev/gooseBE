import {
    Controller,
    Post,
    Body,
    BadRequestException,
    UnauthorizedException,
    Res,
    Get,
    UseGuards,
    UseInterceptors
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

    @UseInterceptors(authCookieInterceptor)
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.login(loginDto.username, loginDto.password, response);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        return this.authService.logout(response);
    }
}
