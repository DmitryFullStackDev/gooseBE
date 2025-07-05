import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthService } from '../services/auth.service'
import { User } from '../models/user.model'
import { AuthController } from '../controllers/auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from '../strategies/jwt.strategy'
import { ConfigService } from '@nestjs/config'
import { HealthController } from '../controllers/health.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    } as any),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController, HealthController],
  exports: [AuthService],
})
export class AuthModule {}
