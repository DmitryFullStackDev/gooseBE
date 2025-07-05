import { Global, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * Configuration interface for round settings
 */
export interface RoundConfig {
  /** Duration of each round in seconds */
  roundDuration: number
  /** Cooldown period between rounds in seconds */
  cooldownDuration: number
}

@Global()
@Injectable()
export class RoundConfigService {
  constructor(private configService: ConfigService) {}

  private getNumberConfig(key: string, defaultValue: number): number {
    const value = this.configService.get<string>(key)
    if (!value) return defaultValue
    const parsed = parseInt(value, 10)
    return isNaN(parsed) ? defaultValue : parsed
  }

  get config(): RoundConfig {
    return {
      roundDuration: this.getNumberConfig('ROUND_DURATION', 3600), // Default: 1 hour in seconds
      cooldownDuration: this.getNumberConfig('COOLDOWN_DURATION', 1800), // Default: 30 minutes in seconds
    }
  }
}
