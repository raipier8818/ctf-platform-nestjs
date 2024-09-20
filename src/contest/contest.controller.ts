import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ContestService } from './contest.service';
import { ContestConditionsDto, ContestConditionsRequestDto, ContestInfoResponseDto, ContestPageResponseDto, PopulatedContestResponseDto as PopulatedContestResponseDto, ContestResponseDto, CreateContestDto, UpdateContestDto } from './contest.dto';
import { LocalAuthGuard, ManagerAuthGuard } from 'src/auth/auth.guard';
import { ScoreboardService } from 'src/scoreboard/scoreboard.service';
import { AuthRequest } from 'src/auth/auth.dto';
import { CreateSubmissionDto, ScoreboardResponseDto } from 'src/scoreboard/scoreboard.dto';
import { Response } from 'express';
import { ProblemInfoResponseDto } from 'src/problem/problem.dto';
import { ProblemService } from 'src/problem/problem.service';

@Controller('contest')
export class ContestController {
  constructor(
    private readonly contestService: ContestService,
    private readonly scoreboardService: ScoreboardService,
    private readonly problemService: ProblemService
  ) {}

  @Post()
  @UseGuards(ManagerAuthGuard)
  async createContest(@Req() req: AuthRequest, @Body() createContestDto: CreateContestDto) {
    try {
      const { username } = req.user;
      createContestDto.host = username;
      await this.contestService.createContest(createContestDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error creating contest");
    }
  }

  @Get()
  @UseGuards(LocalAuthGuard)
  async findContestsByConditions(@Query() conditions: ContestConditionsRequestDto, @Req() request: AuthRequest): Promise<ContestPageResponseDto> {
    const { role } = request.user;
    const contestConditionsDto: ContestConditionsDto = {
      ...conditions,
      status: ["UPCOMING", "RUNNING", "FINISHED", "SUSPENDED"]
    }

    if (role === "manager") {
      delete contestConditionsDto.status;
    }
    
    return await this.contestService.findContestByConditions(contestConditionsDto);
  }

  @Get(':id')
  @UseGuards(LocalAuthGuard)
  async findContestById(@Param('id') id: string): Promise<ContestResponseDto> {
    const result = await this.contestService.findContestById(id);
    if (!result) {
      throw new NotFoundException("Contest not found");
    }
    return result;
  }

  @Get(':id/populate')
  @UseGuards(LocalAuthGuard)
  async findPopulatedContestById(@Param('id') id: string, @Req() request: AuthRequest): Promise<PopulatedContestResponseDto> {
    const result = await this.contestService.findPopulatedContestById(id);
    const { role } = request.user;
    
    if (role === "user" && result.status !== "RUNNING") {
      result.problems = [];
    }

    return result;
  }

  @Get(":id/problem/:problem")
  @UseGuards(LocalAuthGuard)
  async findContestProblemById(@Param('id') id: string, @Param('problem') problem: string): Promise<ProblemInfoResponseDto> {
    const contestResult = await this.contestService.findContestById(id);
    if (!contestResult) {
      throw new NotFoundException("Contest not found");
    }
    
    if (!contestResult.problems.includes(problem)) {
      throw new NotFoundException("Problem not found in contest");
    }

    return await this.problemService.findProblemById(problem);
  }

  @Put(':id')
  @UseGuards(ManagerAuthGuard)
  async updateContestById(@Param('id') id: string, @Body() updateContestDto: UpdateContestDto): Promise<void> {
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
      console.log(problems);
      
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
