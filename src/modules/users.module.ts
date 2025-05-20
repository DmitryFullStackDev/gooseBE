import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {User} from "../models/user.model";
import {UserRoundStatsService} from "../services/userRoundStats.service";
import {UserService} from "../services/user.service";
import {Round} from "../models/round.model";
import {GooseController} from "../controllers/goose.controller";
import {GooseService} from "../services/goose.service";
import {RoundService} from "../services/round.service";
import {UserRoundStats} from "../models/user-round-stats.model";

@Module({
    imports: [SequelizeModule.forFeature([User, Round, UserRoundStats])],
    providers: [UserService, RoundService, UserRoundStatsService, GooseService],
    controllers: [GooseController],
    exports: [GooseService],
})
export class GooseModule {}
