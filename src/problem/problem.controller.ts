import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { CreateProblemDto, ProblemConditions, ProblemInfoResponseDto, ProblemPageResponseDto, ProblemResponseDto, UpdateProblemDto } from './problem.dto';
import { LocalAuthGuard, ManagerAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/auth.dto';

@Controller('problem')
export class ProblemController {
  constructor(
    private readonly problemService: ProblemService,
  ) {}

  @Get(':id')
  @UseGuards(LocalAuthGuard)
  async findProblemById(@Param('id') id: string, @Req() req: AuthRequest): Promise<ProblemResponseDto | ProblemInfoResponseDto>{
    if(req.user.role === "manager"){
      return this.problemService.findProblemById(id);
    }
    else if(req.user.role === "user"){
      return this.problemService.findProblemInfoById(id);
    }
    else{
      throw new ForbiddenException();
    }
  }

  @Get()
  @UseGuards(ManagerAuthGuard)
  async findProblemsByConditions(@Query() conditions: ProblemConditions, @Req() req: AuthRequest): Promise<ProblemPageResponseDto>{    
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

  @Delete(':id')
  @UseGuards(ManagerAuthGuard)
  async deleteProblemById(@Param('id') id: string){
    return this.problemService.deleteProblemById(id);
  }
}
