import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import { AuthModule } from "./modules/auth.module";
import { Round } from "./models/round.model";
import { UserRoundStats } from "./models/user-round-stats.model";
import { RoundModule } from "./modules/round.module";
import { GooseModule } from "./modules/goose.module";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url: configService.getOrThrow('DATABASE_URL'),
        dialect: 'postgres',
        models: [User, Round, UserRoundStats],
        autoLoadModels: true,
        sync: { force: true }, // ❗ For dev only! Remove in production
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // Accept self-signed certs (Render's default)
          },
        },
        timezone: '+00:00',
      }),
    }),
    AuthModule,
    RoundModule,
    GooseModule
  ]
})
export class AppModule {}
