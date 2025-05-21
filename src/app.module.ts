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
        dialect: 'postgres',
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_DATABASE'),
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow<number>('DB_PORT'),
        models: [User, Round, UserRoundStats],
        autoLoadModels: true,
        sync: { force: true },
        timezone: '+00:00',
        dialectOptions: {
          useUTC: true,
          timezone: '+00:00'
        }
      }),
    }),
    AuthModule,
    RoundModule,
    GooseModule
  ]
})
export class AppModule {}
