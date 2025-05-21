import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Round } from '../models/round.model';
import { UserRoundStats } from '../models/user-round-stats.model';
import { User } from '../models/user.model';
import { Op, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class RoundSchedulerService {
    private readonly logger = new Logger(RoundSchedulerService.name);

    constructor(
        @InjectModel(Round) private roundModel: typeof Round,
        @InjectModel(UserRoundStats) private userRoundStatsModel: typeof UserRoundStats,
        @InjectModel(User) private userModel: typeof User,
        private sequelize: Sequelize
    ) {
        this.logger.log('RoundSchedulerService initialized');
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleEndedRounds() {
        try {
            this.logger.debug('Checking for ended rounds...');

            const endedRounds = await this.roundModel.findAll({
                where: {
                    endAt: { [Op.lt]: new Date() },
                    winnerId: null
                }
            });

            this.logger.debug(`Found ${endedRounds.length} ended rounds without winners`);

            // Process each round
            for (const round of endedRounds) {
                this.logger.debug(`Processing round ${round.id}`);
                await this.setWinner(round.id);
            }
        } catch (error) {
            this.logger.error('Error processing ended rounds:', error);
        }
    }

    private async setWinner(roundId: number): Promise<void> {
        await this.sequelize.transaction(async (t) => {
            const [lockedRound] = await this.sequelize.query(
                'SELECT * FROM "Rounds" WHERE id = ? AND "winnerId" IS NULL FOR UPDATE OF "Rounds" SKIP LOCKED',
                {
                    replacements: [roundId],
                    type: QueryTypes.SELECT,
                    transaction: t
                }
            );

            if (!lockedRound) {
                this.logger.debug(`Round ${roundId} not found, already has a winner, or is locked`);
                return;
            }

            const winnerStats = await this.userRoundStatsModel.findOne({
                where: { roundId },
                order: [['points', 'DESC']],
                include: [{ model: User }],
                transaction: t
            });

            if (winnerStats) {
                const winner = await this.userModel.findByPk(winnerStats.dataValues.userId, { transaction: t });
                this.logger.log(`Setting winner for round ${roundId}: User ${winnerStats.dataValues.userId} with ${winnerStats.dataValues.points} points`, winnerStats);

                // Update using raw query to ensure we only update the locked row
                await this.sequelize.query(
                    'UPDATE "Rounds" SET "winnerId" = ? WHERE id = ?',
                    {
                        replacements: [winnerStats.dataValues.userId, roundId],
                        type: QueryTypes.UPDATE,
                        transaction: t
                    }
                );

                const [updatedRound] = await this.sequelize.query(
                    'SELECT r.*, u.username as winner_username FROM "Rounds" r ' +
                    'LEFT JOIN "Users" u ON r."winnerId" = u.id ' +
                    'WHERE r.id = ?',
                    {
                        replacements: [roundId],
                        type: QueryTypes.SELECT,
                        transaction: t
                    }
                );

                this.logger.log(`Winner set successfully: ${winner?.username}, Round data:`, updatedRound);
            } else {
                this.logger.debug(`No participants found for round ${roundId}`);
            }
        });
    }
}
