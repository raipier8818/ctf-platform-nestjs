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

  async pushProblemToContest(_id: string, problem: string){
    return await this.contestRepository.pushProblemToContest(_id, problem);
  }

  async popProblemFromContest(_id: string, problem: string){
    return await this.contestRepository.popProblemFromContest(_id, problem);
  }

  async pushParticipantToContest(_id: string, profile: string){
    return await this.contestRepository.pushParticipantToContest(_id, profile);
  }

  async popParticipantFromContest(_id: string, profile: string){
    return await this.contestRepository.popParticipantFromContest(_id, profile);
  }
}
