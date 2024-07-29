import { Module } from '@nestjs/common';
import { SubmitService } from './submit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Submit, SubmitSchema } from './submit.schema';
import { SubmitRepository } from './submit.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submit.name, schema: SubmitSchema }
    ])
  ],
  controllers: [],
  providers: [SubmitService, SubmitRepository],
  exports: [SubmitService, SubmitRepository]
})
export class SubmitModule {}
