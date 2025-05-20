import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import {UserRoundStats} from "../models/user-round-stats.model";
import {Round} from "../models/round.model";

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
    ): Promise<{ tapsCount: number; points: number }> {
        return this.sequelize.transaction(async (t) => {
            let stats = await this.statsModel.findOne({
                where: { userId, roundId },
                transaction: t,
                lock: t.LOCK.UPDATE,
            });

            if (!stats) {
                stats = await this.statsModel.create(
                    { userId, roundId, tapsCount: 0, points: 0 },
                    { transaction: t }
                );
            }

            const pointsToAdd = this.calculatePointsForTap(stats.tapsCount);

            stats.tapsCount += 1;
            stats.points += pointsToAdd;
            await stats.save({ transaction: t });

            await this.roundModel.increment('totalPoints', {
                by: pointsToAdd,
                where: { id: roundId },
                transaction: t,
            });

            return {
                tapsCount: stats.tapsCount,
                points: stats.points,
            };
        });
    }
}
