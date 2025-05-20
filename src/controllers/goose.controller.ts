import { Controller, Post, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { GooseService } from "../services/goose.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { JwtPayload } from '../types/jwt-payload.type';
import { TapResponse } from '../types/tap-response.type';

@Controller('goose')
@UseGuards(JwtAuthGuard)
export class GooseController {
    constructor(private readonly gooseService: GooseService) {}

    @Post('tap/:roundId')
    async tapGoose(
        @Request() req: { user: JwtPayload },
        @Param('roundId', ParseIntPipe) roundId: number,
    ): Promise<TapResponse> {
        return this.gooseService.tap(req.user, roundId);
    }
}