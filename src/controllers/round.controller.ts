import {Controller, Post, Body, UseGuards, Request, Get, ParseIntPipe, Param} from '@nestjs/common';
import { RoundService } from '../services/round.service';
import {Roles} from "../decorators/roles.decorator";
import {RolesGuard} from "../guards/roles.guard";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";

@Controller('rounds')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoundController {
    constructor(private readonly roundService: RoundService) {}

    @Post()
    @Roles('admin')
    async create(@Body() body: { title: string; startAt: string; endAt: string }, @Request() req) {
        return this.roundService.createRound(
            body.title,
            new Date(body.startAt),
            new Date(body.endAt),
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAll() {
        return this.roundService.findAllRounds();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/details')
    async getRoundDetails(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
    ) {
        return this.roundService.findByIdWithDetails(id, req.user.userId);
    }
}
