import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ContestService } from './contest.service';
import { CreateContestDto } from './contest.dto';
import { ProblemService } from 'src/problem/problem.service';
import { LocalAuthGuard, ManagerAuthGuard } from 'src/auth/auth.guard';
import { ScoreboardService } from 'src/scoreboard/scoreboard.service';
import { AuthRequest } from 'src/auth/auth.dto';
import { CreateSubmissionDto } from 'src/scoreboard/scoreboard.dto';
import { Response } from 'express';

@Controller('contest')
export class ContestController {
  constructor(
    private readonly contestService: ContestService,
    private readonly scoreboardService: ScoreboardService,
  ) {}

  @Post()
  async createContest(@Body() createContestDto: CreateContestDto) {
    return await this.contestService.createContest(createContestDto);
  }

  @Get()
  async findAllContests() {
    return await this.contestService.findAllContests();
  }

  @Get(':id')
  @UseGuards(LocalAuthGuard)
  async findContestById(@Param('id') id: string) {
    const contest = await this.contestService.findContestByIdWithProblems(id);
    if(contest.startTime > new Date()) {
      delete contest.problems;
    }

    return contest;
  }

  // @Get(':id/:problem')
  // async findProblemInContest(@Param('id') id: string, @Param('problem') problem: string) {
  //   const contest = await this.contestService.findContestById(id);
  //   if(!contest || !contest.problems.includes(problem)) {
  //     throw new NotFoundException("Contest not found");
  //   }

  //   return await this.problemService.findProblemById(problem);
  // }

  @Put(':id')
  @UseGuards(ManagerAuthGuard)
  async updateContestById(@Param('id') id: string, @Body() updateContestDto: CreateContestDto) {
    return await this.contestService.updateContestById(id, updateContestDto);
  }
  
  @Put(':id/problems')
  @UseGuards(ManagerAuthGuard)
  async updateProblemInContest(@Param('id') id: string, @Body() problems: Array<string>) {
    return await this.contestService.updateProblemInContest(id, problems);
  }

  @Post(':id/:problem')
  @UseGuards(LocalAuthGuard)
  async submitFlag(@Param('id') id: string, @Param('problem') problem: string, @Body() createSubmissionDto: CreateSubmissionDto, @Req() req: AuthRequest, @Res() res: Response) {
    createSubmissionDto.profile = req.user.profile;
    createSubmissionDto.problem = problem;
    res.json(createSubmissionDto);
    await this.scoreboardService.createSubmission(id, createSubmissionDto);
  }


  @Put(':id/register')
  @UseGuards(LocalAuthGuard)
  async registerContest(@Param('id') id: string, @Req() req: AuthRequest) {
    return await this.contestService.pushParticipantInContest(id, req.user.profile);
  }

  @Put(':id/unregister')
  @UseGuards(LocalAuthGuard)
  async unregisterContest(@Param('id') id: string, @Req() req: AuthRequest) {
    return await this.contestService.popParticipantInContest(id, req.user.profile);
  }  

  @Delete(":id")
  @UseGuards(ManagerAuthGuard)
  async deleteContestById(@Param('id') id: string) {
    return await this.contestService.deleteContestById(id);
  }  

  @Get(':id/scoreboard')
  @UseGuards(LocalAuthGuard)
  async getScoreboard(@Param('id') id: string) {
    return await this.scoreboardService.findScoreboardByContest(id);
  }

  @Post(':id/scoreboard')
  @UseGuards(ManagerAuthGuard)
  async createScoreboard(@Param('id') id: string) {
    return await this.scoreboardService.createScoreboard(id);
  }

  @Delete(':id/scoreboard')
  @UseGuards(ManagerAuthGuard)
  async deleteScoreboard(@Param('id') id: string) {
    return await this.scoreboardService.deleteScoreboardByContest(id);
  }
}
