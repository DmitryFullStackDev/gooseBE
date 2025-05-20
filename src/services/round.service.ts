import {Injectable, NotFoundException, ConflictException, ForbiddenException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {Round} from "../models/round.model";
import {async} from "rxjs";
import {UserRoundStats} from "../models/user-round-stats.model";

@Injectable()
export class RoundService {
    constructor(
        @InjectModel(Round) private roundModel: typeof Round,
        @InjectModel(UserRoundStats) private userRoundStatsModel: typeof UserRoundStats
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

    async createRound(
        title: string,
        startAt: Date,
        endAt: Date,
    ): Promise<Round> {
        if (endAt <= startAt) {
            throw new ConflictException('End date must be after start date');
        }

        const round = await this.roundModel.create({ title, startAt, endAt });
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
                order: [['totalPoints', 'DESC']],
            });
        }

        const userStats = await this.userRoundStatsModel.findOne({
            where: { roundId, userId },
        });

        return {
            round,
            winner: winnerStats ? {
                userId: winnerStats.userId,
                points: winnerStats.points,
            } : null,
            userPoints: userStats ? userStats.points : 0,
        };
    }
}
