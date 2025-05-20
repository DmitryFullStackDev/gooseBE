import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        private jwtService: JwtService,
    ) {}

    async login(username: string, password: string) {
        if (!username || !password) {
            throw new BadRequestException('Username and password must be provided');
        }

        const user = await this.userModel.findOne({ where: { username } });

        if (!user) {
            const role = ['admin', 'nikita'].includes(username) ? username : 'survivor';

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = await this.userModel.create({
                username,
                passwordHash,
                role,
            });

            const payload = { sub: newUser.dataValues.id, username: newUser.dataValues.username, role: newUser.dataValues.role };
            const token = this.jwtService.sign(payload);

            return {
                payload,
                message: 'User created',
                access_token: token,
                user: {
                    id: newUser.dataValues.id,
                    username: newUser.dataValues.username,
                    role: newUser.dataValues.role,
                },
            };
        }

        const isPasswordValid = await bcrypt.compare(password, user.dataValues.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Password incorrect');
        }

        const payload = { sub: user.dataValues.id, username: user.dataValues.username, role: user.dataValues.role };
        const token = this.jwtService.sign(payload);

        return {
            message: 'Login successful',
            access_token: token,
            user: {
                id: user.dataValues.id,
                username: user.dataValues.username,
                role: user.dataValues.role,
            },
        };
    }
}
