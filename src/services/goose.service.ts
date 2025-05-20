import { Injectable } from '@nestjs/common';
import { UserRoundStatsService } from "./userRoundStats.service";
import { RoundService } from "./round.service";
import { UserService } from "./user.service";
import { JwtPayload } from '../types/jwt-payload.type';
import { TapResponse } from '../types/tap-response.type';

@Injectable()
export class GooseService {
    constructor(
        private readonly userService: UserService,
        private readonly roundService: RoundService,
        private readonly statsService: UserRoundStatsService,
    ) {}

    async tap(user: JwtPayload, roundId: number): Promise<TapResponse> {
        if (user.role === 'nikita') {
            return {
                message: 'Tap received but not counted (Nikita)',
                tapsCount: 0,
                points: 0
            };
        }

        const round = await this.roundService.findById(roundId);
        this.roundService.checkIsActive(round);

        const stats = await this.statsService.incrementTapAndPoints(user.userId, roundId);
        console.log(stats)
        return {
            message: 'Tap counted',
            tapsCount: stats.dataValues.tapsCount,
            points: stats.dataValues.points
        };
    }
}
