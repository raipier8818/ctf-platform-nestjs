import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './profile.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema }
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileService, ProfileRepository]
})
export class ProfileModule {}
