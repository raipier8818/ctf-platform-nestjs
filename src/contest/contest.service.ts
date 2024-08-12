import { Injectable } from '@nestjs/common';
import { ContestRepository } from './contest.repository';
import { CreateContestDto, UpdateContestDto } from './contest.dto';

@Injectable()
export class ContestService {
  constructor(
    private readonly contestRepository: ContestRepository,
  ) {}

  async createContest(contest: CreateContestDto) {
    return await this.contestRepository.createContest(contest);
  }

  async findContestByIdWithProblems(_id: string) {
    return await this.contestRepository.findContestByIdWithProblems(_id);
  }

  async findContestById(_id: string) {
    return await this.contestRepository.findContestById(_id);
  }

  async findAllContests() {
    return await this.contestRepository.findAllContests();
  }

  async updateContestById(_id: string, contest: UpdateContestDto) {
    return await this.contestRepository.updateContestById(_id, contest);
  }

  async deleteContestById(_id: string){
    return await this.contestRepository.deleteContestById(_id);
  }

  async updateProblemInContest(_id: string, problems: Array<string>){
    return await this.contestRepository.updateProblemInContest(_id, problems);
  }

  async pushParticipantInContest(_id: string, profile: string){
    return await this.contestRepository.pushParticipantInContest(_id, profile);
  }

  async popParticipantInContest(_id: string, profile: string){
    return await this.contestRepository.popParticipantInContest(_id, profile);
  }
}
