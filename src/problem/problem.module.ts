import { Module } from '@nestjs/common';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { ProblemRepository } from './problem.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ProblemSchema } from './problem.schema';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Problem', schema: ProblemSchema }
    ]),
    ProfileModule
  ],
  controllers: [ProblemController],
  providers: [ProblemService, ProblemRepository],
  exports: [ProblemService]
})
export class ProblemModule {}
