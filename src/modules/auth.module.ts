import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {AuthService} from "../services/auth.service";
import {User} from "../models/user.model";
import {AuthController} from "../controllers/auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "../strategies/jwt.strategy";

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        PassportModule,
        JwtModule.register({
            secret: 'my-secret',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
