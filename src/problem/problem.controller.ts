import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { CreateProblemDto, ProblemConditions, SubmitFlagDto, UpdateProblemDto } from './problem.dto';
import { AdminAuthGuard, LocalAuthGuard, ManagerAuthGuard } from 'src/auth/auth.guard';
import { SubmitService } from 'src/submit/submit.service';
import { CreateSubmitDto } from 'src/submit/submit.dto';
import { AuthRequest } from 'src/auth/auth.dto';
import { Response } from 'express';
import { ProfileService } from 'src/profile/profile.service';

@Controller('problem')
export class ProblemController {
  constructor(
    private readonly problemService: ProblemService,
    private readonly submitService: SubmitService,
    private readonly proflieService: ProfileService,
  ) {}

  @Get(':id')
  async findProblemById(@Param('id') id: string){
    return this.problemService.findProblemById(id);
  }

  @Get()
  async findProblemByConditions(@Query() conditions: ProblemConditions){
    return this.problemService.findProblemByConditions(conditions);
  }

  @Post()
  // @UseGuards(AdminAuthGuard)
  async createProblem(@Body() createProblemDto: CreateProblemDto){
    return this.problemService.createProblem(createProblemDto);
  }

  @Put(':id')
  // @UseGuards(ManagerAuthGuard)
  async updateProblemById(@Param('id') id: string, @Body() problem: UpdateProblemDto){
    return this.problemService.updateProblemById(id, problem);
  }

  @Delete(':id')
  // @UseGuards(ManagerAuthGuard)
  async deleteProblemById(@Param('id') id: string){
    return this.problemService.deleteProblemById(id);
  }

  @Post(':id/submit')
  @UseGuards(LocalAuthGuard)
  async submitFlag(@Param('id') id: string, @Body() submitFlag: SubmitFlagDto, @Req() req: AuthRequest, @Res() res: Response){
    const createSubmitDto: CreateSubmitDto = {
      profile: req.user.profile,
      problem: id,
      flag: submitFlag.flag
    }
    const submit = await this.submitService.create(createSubmitDto);
    res.send(submit);

    const result = await this.problemService.compareFlag(id, submitFlag.flag);
    if(result){
      // todo : update user score if in contest
      

      // todo : update user solved problems
      this.proflieService.addSolvedProblem(req.user.profile, id);

      // todo : update submit status
      this.submitService.updateSubmitStatus(submit.id, "ACCEPTED");
    }else{
      // todo : update submit status
      this.submitService.updateSubmitStatus(submit.id, "WRONG");
    }

    console.log(result);
  }
}
