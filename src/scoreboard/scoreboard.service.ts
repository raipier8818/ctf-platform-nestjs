import { Injectable } from '@nestjs/common';
import { ScoreboardRepository } from './scoreboard.repository';
import { CreateSubmissionDto } from './scoreboard.dto';
import { ProblemService } from 'src/problem/problem.service';

@Injectable()
export class ScoreboardService {
  constructor(
    private readonly problemService: ProblemService,
    private readonly scoreboardRepository: ScoreboardRepository
  ) {}

  async createScoreboard(contest: string){
    return this.scoreboardRepository.createScoreboard(contest);
  }

  async findScoreboardByContest(contest: string){
    return this.scoreboardRepository.findScoreboardByContest(contest);
  }

  async deleteScoreboardByContest(contest: string){
    return this.scoreboardRepository.deleteScoreboardByContest(contest);
  }

  async createSubmission(contest: string, createSubmissionDto: CreateSubmissionDto){
    const solved = await this.problemService.compareFlag(createSubmissionDto.problem, createSubmissionDto.flag);
    createSubmissionDto.solved = solved;
    createSubmissionDto.score = solved ? 100 : 0;
    delete createSubmissionDto.flag;

    return this.scoreboardRepository.createSubmission(contest, createSubmissionDto);
  }
}
