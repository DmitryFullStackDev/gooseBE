import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Round } from '../models/round.model';
import { UserRoundStats } from '../models/user-round-stats.model';
import { RoundService } from '../services/round.service';
import { RoundController } from '../controllers/round.controller';
import { RoundConfigService } from '../config/round.config';
import { RoundSchedulerService } from '../services/round-scheduler.service';
import { User } from '../models/user.model';

@Module({
    imports: [SequelizeModule.forFeature([Round, UserRoundStats, User])],
    providers: [RoundService, RoundConfigService, RoundSchedulerService],
    controllers: [RoundController],
    exports: [RoundService],
})
export class RoundModule {}
