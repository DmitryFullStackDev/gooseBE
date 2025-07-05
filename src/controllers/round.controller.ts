import { Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common'
import { RoundService } from '../services/round.service'
import { Roles } from '../decorators/roles.decorator'
import { RolesGuard } from '../guards/roles.guard'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RoundConfigService } from '../config/round.config'

@Controller('rounds')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoundController {
  constructor(
    private readonly roundService: RoundService,
    private readonly roundConfigService: RoundConfigService,
  ) {}

  @Post()
  @Roles('admin')
  async create() {
    const round = await this.roundService.createRound()
    const config = this.roundConfigService.config
    return {
      ...round.toJSON(),
      config: {
        roundDuration: config.roundDuration,
        cooldownDuration: config.cooldownDuration,
      },
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    const rounds = await this.roundService.findAllRounds()
    const config = this.roundConfigService.config
    return {
      rounds,
      config: {
        roundDuration: config.roundDuration,
        cooldownDuration: config.cooldownDuration,
      },
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/details')
  async setWinner(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.roundService.setWinner(id, req.user.userId)
  }
}
