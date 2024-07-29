import { Module } from '@nestjs/common';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ContestRepository } from './contest.repository';
import { ContestSchema } from './contest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Contest', schema: ContestSchema }
    ])
  ],
  controllers: [ContestController],
  providers: [ContestService, ContestRepository],
})
export class ContestModule {}
