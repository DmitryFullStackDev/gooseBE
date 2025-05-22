import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UserRoundStats } from "../models/user-round-stats.model";
import { Round } from "../models/round.model";

@Injectable()
export class UserRoundStatsService {
    constructor(
        @InjectModel(UserRoundStats) private statsModel: typeof UserRoundStats,
        @InjectModel(Round) private roundModel: typeof Round,
        private sequelize: Sequelize,
    ) {}

    private calculatePointsForTap(currentTapsCount: number): number {
        return (currentTapsCount + 1) % 11 === 0 ? 10 : 1;
    }

    async incrementTapAndPoints(
        userId: number,
        roundId: number,
    ): Promise<UserRoundStats> {
        return this.sequelize.transaction(async (t) => {
            const [stats, created] = await this.statsModel.findOrCreate({
                where: { userId, roundId },
                defaults: {
                    userId,
                    roundId,
                    tapsCount: 0,
                    points: 0
                },
                transaction: t,
                lock: true
            });

            const pointsToAdd = this.calculatePointsForTap(stats.dataValues.tapsCount);

            await stats.increment({
                tapsCount: 1,
                points: pointsToAdd
            }, { transaction: t });

            await stats.reload({ transaction: t });

            await this.roundModel.increment('totalPoints', {
                by: pointsToAdd,
                where: { id: roundId },
                transaction: t,
            });

            return stats;
        });
    }
}
