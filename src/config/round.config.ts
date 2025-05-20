import { Injectable, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface RoundConfig {
    roundDuration: number;
    cooldownDuration: number;
}

@Global()
@Injectable()
export class RoundConfigService {
    constructor(private configService: ConfigService) {}

    private getNumberConfig(key: string, defaultValue: number): number {
        const value = this.configService.get<string>(key);
        if (!value) return defaultValue;
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    get config(): RoundConfig {
        return {
            roundDuration: this.getNumberConfig('ROUND_DURATION', 60),
            cooldownDuration: this.getNumberConfig('COOLDOWN_DURATION', 30),
        };
    }
} 