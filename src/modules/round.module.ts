import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Round } from '../models/round.model';
import { UserRoundStats } from '../models/user-round-stats.model';
import { RoundService } from '../services/round.service';
import { RoundController } from '../controllers/round.controller';

@Module({
    imports: [SequelizeModule.forFeature([Round, UserRoundStats])],
    providers: [RoundService],
    controllers: [RoundController],
    exports: [RoundService],
})
export class RoundModule {}
