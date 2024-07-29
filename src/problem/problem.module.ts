import { Module } from '@nestjs/common';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { ProblemRepository } from './problem.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ProblemSchema } from './problem.schema';
import { SubmitModule } from 'src/submit/submit.module';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Problem', schema: ProblemSchema }
    ]),
    SubmitModule,
    ProfileModule
  ],
  controllers: [ProblemController],
  providers: [ProblemService, ProblemRepository]
})
export class ProblemModule {}
