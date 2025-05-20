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

    checkIsActive(round: Round): void {
        const now = new Date();
        if (now < round.startAt || now > round.endAt) {
            throw new ConflictException('Round is not active');
        }
    }

    private calculateRoundDates(): { startAt: Date; endAt: Date } {
        const now = new Date();
        const config = this.roundConfigService.config;

        const startAt = new Date(now.getTime() + config.cooldownDuration * 60000);

        const endAt = new Date(startAt.getTime() + config.roundDuration * 60000);

        return { startAt, endAt };
    }

    async createRound(title: string): Promise<Round> {
        const latestRound = await this.roundModel.findOne({
            order: [['endAt', 'DESC']],
        });

        if (latestRound) {
            const now = new Date();
            if (latestRound.endAt > now) {
                throw new ConflictException('Cannot create a new round while another is active or in cooldown');
            }
        }

        const { startAt, endAt } = this.calculateRoundDates();

        const round = await this.roundModel.create({
            title,
            startAt,
            endAt,
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

        let winnerStats: UserRoundStats | null  = null;
        const now = new Date();
        if (now > round.endAt) {
            winnerStats = await this.userRoundStatsModel.findOne({
                where: { roundId },
                order: [['points', 'DESC']],
            });
        }

        const userStats = await this.userRoundStatsModel.findOne({
            where: { roundId, userId },
        });

        const timeUntilStart = now < round.startAt
            ? Math.ceil((round.startAt.getTime() - now.getTime()) / 1000)
            : 0;

        return {
            round,
            timeUntilStart,
            winner: winnerStats ? {
                userId: winnerStats.userId,
                points: winnerStats.points,
            } : null,
            userPoints: userStats ? userStats.points : 0,
        };
    }
}
