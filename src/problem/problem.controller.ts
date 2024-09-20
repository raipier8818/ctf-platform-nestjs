import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { CreateProblemDto, ProblemConditions, ProblemHeaderResponseDto, ProblemInfoResponseDto, ProblemPageResponseDto, ProblemResponseDto, UpdateProblemDto, UpdateProblemStatusDto } from './problem.dto';
import { LocalAuthGuard, ManagerAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/auth.dto';

@Controller('problem')
export class ProblemController {
  constructor(
    private readonly problemService: ProblemService,
  ) {}

  @Get('/all')
  @UseGuards(ManagerAuthGuard)
  async findAllProblems(): Promise<ProblemHeaderResponseDto[]> {
    return await this.problemService.findAllProblems();
  }
  
  @Get(':id')
  @UseGuards(LocalAuthGuard)
  async findProblemById(@Param('id') id: string, @Req() req: AuthRequest): Promise<ProblemResponseDto>{
    if(req.user.role === "manager"){
      return this.problemService.findProblemById(id);
    }
    else{
      throw new ForbiddenException();
    }
  }

  @Get()
  @UseGuards(LocalAuthGuard)
  async findProblemsByConditions(@Query() conditions: ProblemConditions): Promise<ProblemPageResponseDto>{    
    const result = await this.problemService.findProblemsByConditions(conditions);
    return result;
  }


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

  @Put(':id/status')
  @UseGuards(ManagerAuthGuard)
  async updateProblemStatusById(@Param('id') id: string, @Body('status') status: UpdateProblemStatusDto){
    return this.problemService.updateProblemStatusById(id, status);
  }

  @Delete(':id')
  @UseGuards(ManagerAuthGuard)
  async deleteProblemById(@Param('id') id: string){
    return this.problemService.deleteProblemById(id);
  }
}
