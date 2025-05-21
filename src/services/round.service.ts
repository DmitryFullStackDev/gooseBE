import {Injectable, NotFoundException, ConflictException, ForbiddenException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {Round} from "../models/round.model";
import {async} from "rxjs";
import {UserRoundStats} from "../models/user-round-stats.model";
import { RoundConfigService } from '../config/round.config';

@Injectable()
export class RoundService {
    constructor(
        @InjectModel(Round) private roundModel: typeof Round,
        @InjectModel(UserRoundStats) private userRoundStatsModel: typeof UserRoundStats,
        private roundConfigService: RoundConfigService
    ) {}

    async findById(id: number): Promise<Round> {
        const round = await this.roundModel.findByPk(id);
        if (!round) throw new NotFoundException('Round not found');
        return round;
    }

    private getNowUTC(): Date {
        return new Date();
    }

    checkIsActive(round: Round): void {
        const now = this.getNowUTC();

        if (now < round.dataValues.startAt) {
            throw new ConflictException('Round has not started yet');
        }

        if (now > round.dataValues.endAt) {
            throw new ConflictException('Round has already ended');
        }
    }

    private calculateRoundDates(): { startAt: Date; endAt: Date } {
        const now = this.getNowUTC();
        const config = this.roundConfigService.config;

        const startAt = new Date(now.getTime() + config.cooldownDuration * 1000);
        const endAt = new Date(startAt.getTime() + config.roundDuration * 1000);

        return { startAt, endAt };
    }

    async createRound(): Promise<Round> {
        const latestRound = await this.roundModel.findOne({
            order: [['endAt', 'DESC']],
        });

        if (latestRound) {
            const now = this.getNowUTC();
            const latestEndAt = latestRound.endAt ? new Date(latestRound.endAt) : null;
            if (latestEndAt && latestEndAt > now) {
                throw new ConflictException('Cannot create a new round while another is active or in cooldown');
            }
        }

        const { startAt, endAt } = this.calculateRoundDates();

        const round = await this.roundModel.create({
            startAt: startAt.toISOString(),
            endAt: endAt.toISOString(),
        });

        return round;
    }

    async findAllRounds(): Promise<Round[]> {
        return this.roundModel.findAll({
            order: [['startAt', 'ASC']],
        });
    }

    async findByIdWithDetails(roundId: number, userId: number) {
        const round = await this.roundModel.findByPk(roundId);
        if (!round) throw new NotFoundException('Round not found');

        let winnerStats: UserRoundStats | null = null;
        const now = this.getNowUTC();

        const roundData = round.toJSON();

        let startTime: Date | null = null;
        try {
            if (roundData && roundData.startAt) {
                startTime = new Date(roundData.startAt);
            } else {
            }
        } catch (error) {
            console.error('Error parsing start time:', error);
        }

        let timeUntilStart = 0;
        if (startTime && !isNaN(startTime.getTime())) {
            const currentTime = now.getTime();
            const startTimeMs = startTime.getTime();
            if (startTimeMs > currentTime) {
                timeUntilStart = Math.ceil((startTimeMs - currentTime) / 1000);
            }

        }

        if (roundData.endAt) {
            const endTime = new Date(roundData.endAt);
            if (!isNaN(endTime.getTime()) && endTime < now) {
                winnerStats = await this.userRoundStatsModel.findOne({
                    where: { roundId },
                    order: [['points', 'DESC']],
                });
            }
        }

        const userStats = await this.userRoundStatsModel.findOne({
            where: { roundId, userId },
        });

        const response = {
            round: roundData,
            timeUntilStart,
            winner: winnerStats ? {
                userId: winnerStats.userId,
                points: winnerStats.points,
            } : null,
            userPoints: userStats ? userStats.points : 0,
        };

        return response;
    }
}
