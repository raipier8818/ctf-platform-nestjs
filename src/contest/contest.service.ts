import { Injectable } from '@nestjs/common';
import { ContestRepository } from './contest.repository';
import { ContestConditionsRequestDto, ContestConditionsDto, ContestInfoResponseDto, ContestPageResponseDto, PopulatedContestResponseDto, ContestResponseDto, CreateContestDto, UpdateContestDto } from './contest.dto';

@Injectable()
export class ContestService {
  constructor(
    private readonly contestRepository: ContestRepository,
  ) {}

  async createContest(contest: CreateContestDto) {
    await this.contestRepository.createContest(contest);
  }

  async findPopulatedContestById(_id: string): Promise<PopulatedContestResponseDto> {
    return await this.contestRepository.findPopulatedContestById(_id);
  }

  async findContestByConditions(conditions: ContestConditionsDto): Promise<ContestPageResponseDto> {
    return await this.contestRepository.findContestsByConditions(conditions);
  }

  async findContestById(_id: string): Promise<ContestResponseDto> {
    return await this.contestRepository.findContestById(_id);
  }

  async findAllContests(): Promise<ContestInfoResponseDto[]> {
    return await this.contestRepository.findAllContests();
  }

  async updateContestById(_id: string, contest: UpdateContestDto): Promise<void> {
    await this.contestRepository.updateContestById(_id, contest);
  }

  async deleteContestById(_id: string): Promise<void> {
    await this.contestRepository.deleteContestById(_id);
  }

  async updateProblemInContest(_id: string, problems: Array<string>): Promise<void> {
    await this.contestRepository.updateProblemInContest(_id, problems);
  }

  async pushParticipantInContest(_id: string, profile: string): Promise<void> {
    await this.contestRepository.pushParticipantInContest(_id, profile);
  }

  async popParticipantInContest(_id: string, profile: string): Promise<void> {
    await this.contestRepository.popParticipantInContest(_id, profile);
  }

  async removeProblemFromContest(_id: string, problem: string): Promise<void> {
    await this.contestRepository.removeProblemFromContest(_id, problem);
  }
}
