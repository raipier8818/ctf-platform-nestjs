import { Module } from '@nestjs/common';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ContestRepository } from './contest.repository';
import { ContestSchema } from './contest.schema';
import { ProblemModule } from 'src/problem/problem.module';
import { ScoreboardModule } from 'src/scoreboard/scoreboard.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Contest', schema: ContestSchema }
    ]),
    ScoreboardModule
  ],
  controllers: [ContestController],
  providers: [ContestService, ContestRepository],
})
export class ContestModule {}
