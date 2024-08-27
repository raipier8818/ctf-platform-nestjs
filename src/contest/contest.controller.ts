import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ContestService } from './contest.service';
import { ContestInfoResponseDto, ContestResponseDto, CreateContestDto } from './contest.dto';
import { LocalAuthGuard, ManagerAuthGuard } from 'src/auth/auth.guard';
import { ScoreboardService } from 'src/scoreboard/scoreboard.service';
import { AuthRequest } from 'src/auth/auth.dto';
import { CreateSubmissionDto, ScoreboardResponseDto } from 'src/scoreboard/scoreboard.dto';
import { Response } from 'express';

@Controller('contest')
export class ContestController {
  constructor(
    private readonly contestService: ContestService,
    private readonly scoreboardService: ScoreboardService,
  ) {}

  @Post()
  @UseGuards(ManagerAuthGuard)
  async createContest(@Body() createContestDto: CreateContestDto) {
    try {
      await this.contestService.createContest(createContestDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error creating contest");
    }
  }

  @Get()
  @UseGuards(LocalAuthGuard)
  async findAllContests(): Promise<ContestInfoResponseDto[]> {
    try {
      return await this.contestService.findAllContests();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error fetching contests");
    }
  }

  @Get(':id')
  @UseGuards(LocalAuthGuard)
  async findContestById(@Param('id') id: string): Promise<ContestResponseDto> {
    try {
      const contest = await this.contestService.findContestByIdWithProblems(id);
      if(contest.startTime > new Date()) {
        delete contest.problems;
      }
  
      return contest;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error fetching contest");
    }
  }

  @Put(':id')
  @UseGuards(ManagerAuthGuard)
  async updateContestById(@Param('id') id: string, @Body() updateContestDto: CreateContestDto): Promise<void> {
    try {
      await this.contestService.updateContestById(id, updateContestDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error updating contest");
    }
  }
  
  @Put(':id/problems')
  @UseGuards(ManagerAuthGuard)
  async updateProblemInContest(@Param('id') id: string, @Body() problems: Array<string>) {
    try {
      return await this.contestService.updateProblemInContest(id, problems);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error updating contest problems");
    }
  }

  @Post(':id/:problem/submit')
  @UseGuards(LocalAuthGuard)
  async submitFlag(@Param('id') id: string, @Param('problem') problem: string, @Body() createSubmissionDto: CreateSubmissionDto, @Req() req: AuthRequest, @Res() res: Response): Promise<void> {
    try {
      createSubmissionDto.profile = req.user.profile;
      createSubmissionDto.problem = problem;
      res.json(createSubmissionDto);
      await this.scoreboardService.createSubmission(id, createSubmissionDto);
    } catch (error) {
      throw new InternalServerErrorException("Error submitting flag");
    }
  }


  @Put(':id/register')
  @UseGuards(LocalAuthGuard)
  async registerContest(@Param('id') id: string, @Req() req: AuthRequest): Promise<void> {
    try {
      await this.contestService.pushParticipantInContest(id, req.user.profile);
    } catch (error) {
      throw new InternalServerErrorException("Error registering contest");
    }
  }

  @Put(':id/unregister')
  @UseGuards(LocalAuthGuard)
  async unregisterContest(@Param('id') id: string, @Req() req: AuthRequest): Promise<void> {
    try {
      await this.contestService.popParticipantInContest(id, req.user.profile);
    } catch (error) {
      throw new InternalServerErrorException("Error unregistering contest");
    }
  }  

  @Delete(":id")
  @UseGuards(ManagerAuthGuard)
  async deleteContestById(@Param('id') id: string) : Promise<void> {
    try {
      await this.contestService.deleteContestById(id);
    } catch (error) {
      throw new InternalServerErrorException("Error deleting contest");
    }
  }  

  @Get(':id/scoreboard')
  @UseGuards(LocalAuthGuard)
  async getScoreboard(@Param('id') id: string): Promise<ScoreboardResponseDto> {
    try {
      return await this.scoreboardService.findScoreboardByContest(id);  
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error fetching scoreboard");  
    }
  }

  @Post(':id/scoreboard')
  @UseGuards(ManagerAuthGuard)
  async createScoreboard(@Param('id') id: string) : Promise<void> {
    try {
      await this.scoreboardService.createScoreboard(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error creating scoreboard");
    }
  }

  @Delete(':id/scoreboard')
  @UseGuards(ManagerAuthGuard)
  async deleteScoreboard(@Param('id') id: string) : Promise<void> {
    try {
      await this.scoreboardService.deleteScoreboardByContest(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error deleting scoreboard");
    }
  }
}
