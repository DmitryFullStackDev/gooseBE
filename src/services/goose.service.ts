import { Injectable } from '@nestjs/common';
import { UserRoundStatsService } from "./userRoundStats.service";
import { RoundService } from "./round.service";
import { UserService } from "./user.service";

@Injectable()
export class GooseService {
    constructor(
        private readonly userService: UserService,
        private readonly roundService: RoundService,
        private readonly statsService: UserRoundStatsService,
    ) {}

    async tap(userId: number, roundId: number) {
        const user = await this.userService.findById(userId);

        if (user.role === 'nikita') {
            return {
                message: 'Tap received but not counted (Nikita)',
                tapsCount: 0,
                points: 0
            };
        }

        const round = await this.roundService.findById(roundId);
        this.roundService.checkIsActive(round);

        return this.statsService.incrementTapAndPoints(userId, roundId);
    }
}
