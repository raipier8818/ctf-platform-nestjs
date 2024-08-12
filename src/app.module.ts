import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import mongooseConfig from './config/mongoose.config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContestModule } from './contest/contest.module';
import { ProfileModule } from './profile/profile.module';
import { ProblemModule } from './problem/problem.module';
import appConfig from './config/app.config';
import { ScoreboardModule } from './scoreboard/scoreboard.module';


@Module({
  imports: [
    AccountModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      isGlobal: true,
      load: [appConfig, mongooseConfig]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigType<typeof mongooseConfig>) => {
        // console.log(config);
        
        return {
          uri: config.uri,
          dbName: config.name,
        }
      },
      inject: [mongooseConfig.KEY],
    }),
    ContestModule,
    ProfileModule,
    ProblemModule,
    ScoreboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
