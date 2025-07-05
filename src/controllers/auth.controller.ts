import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

class LoginDto {
  username: string
  password: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return { message: 'Logout successful' }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return { user: req.user }
  }
}
