import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { LoggerMiddleware } from './middleware/logger.middleware';
import { DateModule } from './date/date.module';


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
    ScoreboardModule,
    DateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(
    consumer: MiddlewareConsumer
  ) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
