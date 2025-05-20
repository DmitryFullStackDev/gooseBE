import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Round } from '../models/round.model';
import { UserRoundStats } from '../models/user-round-stats.model';
import { GooseController } from '../controllers/goose.controller';
import { GooseService } from '../services/goose.service';
import { UserService } from '../services/user.service';
import { RoundService } from '../services/round.service';
import { UserRoundStatsService } from '../services/userRoundStats.service';

@Module({
    imports: [
        SequelizeModule.forFeature([
            User,
            Round,
            UserRoundStats
        ])
    ],
    controllers: [GooseController],
    providers: [
        GooseService,
        UserService,
        RoundService,
        UserRoundStatsService
    ],
    exports: [GooseService]
})
export class GooseModule {} 