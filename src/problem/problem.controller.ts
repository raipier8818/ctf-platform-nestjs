import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { CreateProblemDto, ProblemConditions, SubmitFlagDto, UpdateProblemDto } from './problem.dto';
import { AdminAuthGuard, LocalAuthGuard, ManagerAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/auth.dto';
import { Response } from 'express';
import { ProfileService } from 'src/profile/profile.service';

@Controller('problem')
export class ProblemController {
  constructor(
    private readonly problemService: ProblemService,
    private readonly proflieService: ProfileService,
  ) {}

  // @Get(':id')
  // async findProblemById(@Param('id') id: string){
  //   return this.problemService.findProblemById(id);
  // }

  // @Get()
  // async findProblemByConditions(@Query() conditions: ProblemConditions){
  //   return this.problemService.findProblemByConditions(conditions);
  // }

  @Post()
  @UseGuards(ManagerAuthGuard)
  async createProblem(@Body() createProblemDto: CreateProblemDto){
    return this.problemService.createProblem(createProblemDto);
  }

  @Put(':id')
  @UseGuards(ManagerAuthGuard)
  async updateProblemById(@Param('id') id: string, @Body() problem: UpdateProblemDto){
    return this.problemService.updateProblemById(id, problem);
  }

  @Delete(':id')
  @UseGuards(ManagerAuthGuard)
  async deleteProblemById(@Param('id') id: string){
    return this.problemService.deleteProblemById(id);
  }
}
