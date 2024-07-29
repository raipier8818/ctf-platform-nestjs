import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ContestService } from './contest.service';
import { CreateContestDto } from './contest.dto';

@Controller('contest')
export class ContestController {
  constructor(
    private readonly contestService: ContestService,
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
  async findContestById(@Param('id') id: string) {
    return await this.contestService.findContestById(id);
  }

  @Put(':id')
  async updateContestById(@Param('id') id: string, @Body() updateContestDto: CreateContestDto) {
    return await this.contestService.updateContestById(id, updateContestDto);
  }

  @Put(':id/add-problem/:problem')
  async pushProblemToContest(@Param('id') id: string, @Param('problem') problem: string) {
    return await this.contestService.pushProblemToContest(id, problem);
  }

  @Put(':id/remove-problem/:problem')
  async popProblemFromContest(@Param('id') id: string, @Param('problem') problem: string) {
    return await this.contestService.popProblemFromContest(id, problem);
  }

  @Put(':id/add-participant/:profile')
  async pushParticipantToContest(@Param('id') id: string, @Param('profile') profile: string) {
    return await this.contestService.pushParticipantToContest(id, profile);
  }

  @Put(':id/remove-participant/:profile')
  async popParticipantFromContest(@Param('id') id: string, @Param('profile') profile: string) {
    return await this.contestService.popParticipantFromContest(id, profile);
  }  

  @Delete(":id")
  async deleteContestById(@Param('id') id: string) {
    return await this.contestService.deleteContestById(id);
  }  
}
