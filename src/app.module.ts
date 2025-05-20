import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import {AuthModule} from "./modules/auth.module";
import {Round} from "./models/round.model";
import {UserRoundStats} from "./models/user-round-stats.model";
import {RoundModule} from "./modules/round.module";
import {GooseModule} from "./modules/goose.module";

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      username: 'nestuser',
      password: 'strongpassword',
      database: 'mynestdb',
      host: 'localhost',
      port: 5432,
      models: [User, Round, UserRoundStats],
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule, RoundModule, GooseModule
  ],
})
export class AppModule {}
