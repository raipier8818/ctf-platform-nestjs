import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './account.schema';
import { AccountRepository } from './account.repository';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema }
    ]),
    ProfileModule
  ],  
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  exports: [AccountService, AccountRepository]
})
export class AccountModule {}
