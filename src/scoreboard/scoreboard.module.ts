import { Module } from '@nestjs/common';
import { ScoreboardService } from './scoreboard.service';
import { ScoreboardRepository } from './scoreboard.repository';
import { ScoreboardSchema } from './scoreboard.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProblemModule } from 'src/problem/problem.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Scoreboard', schema: ScoreboardSchema }
    ]),
    ProblemModule
  ],
  providers: [ScoreboardService, ScoreboardRepository],
  exports: [ScoreboardService, ScoreboardRepository]
})
export class ScoreboardModule {}
