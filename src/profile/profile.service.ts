import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { ProfileConditionsDto, UpdateProfileDto } from './profile.dto';
import { ClientSession } from 'mongoose';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
  ) {}
  
  createProfileByAccountId(account: string, session?: ClientSession) {
    return this.profileRepository.createProfile(account, session);
  }

  findProfileById(_id: string) {
    return this.profileRepository.findProfileById(_id);
  }

  findProfileByAccount(_id: string) {
    return this.profileRepository.findProfileByAccount(_id);
  }

  findProfileByConditions(conditions: ProfileConditionsDto) {
    return this.profileRepository.findProfileByConditions(conditions);
  }

  updateProfileByAccountId(_id: string, updateProfileDto: UpdateProfileDto) {
    return this.profileRepository.updateProfileByAccountId(_id, updateProfileDto);
  }

  deleteProfileByAccountId(_id: string, session?: ClientSession) {
    return this.profileRepository.deleteProfileByAccountId(_id, session);
  }

  addSolvedProblem(_id: string, problem: string) {
    return this.profileRepository.addSolvedProblem(_id, problem);
  }
}
