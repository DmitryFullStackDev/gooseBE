import { Controller, Post, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { GooseService } from "../services/goose.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller('goose')
@UseGuards(JwtAuthGuard)
export class GooseController {
    constructor(private readonly gooseService: GooseService) {}

    @Post('tap/:roundId')
    async tapGoose(
        @Request() req,
        @Param('roundId', ParseIntPipe) roundId: number,
    ) {
        const result = await this.gooseService.tap(req.user.userId, roundId);
        
        return {
            message: 'Tap counted',
            tapsCount: result.tapsCount,
            points: result.points,
        };
    }
}