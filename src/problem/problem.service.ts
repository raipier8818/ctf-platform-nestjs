import { Injectable } from '@nestjs/common';
import { ProblemRepository } from './problem.repository';
import { CreateProblemDto, ProblemConditions, ProblemHeaderResponseDto, ProblemInfoResponseDto, ProblemPageResponseDto, ProblemResponseDto, UpdateProblemDto, UpdateProblemStatusDto } from './problem.dto';

@Injectable()
export class ProblemService {
  constructor(
    private readonly problemRepository: ProblemRepository
  ) {} 

  async createProblem(problem: CreateProblemDto): Promise<void>{
    return this.problemRepository.createProblem(problem);
  }

  async findProblemById(_id: string): Promise<ProblemResponseDto>{
    return this.problemRepository.findProblemById(_id);
  }

  async findAllProblems(): Promise<ProblemHeaderResponseDto[]>{
    return await this.problemRepository.findAllProblems();
  }

  async findProblemsByConditions(conditions: ProblemConditions): Promise<ProblemPageResponseDto>{
    return this.problemRepository.findProblemsByConditions(conditions);
  }

  async findProblemInfoById(_id: string): Promise<ProblemInfoResponseDto>{
    return this.problemRepository.findProblemInfoById(_id);
  }

  async updateProblemById(_id: string, problem: UpdateProblemDto): Promise<void>{
    return this.problemRepository.updateProblemById(_id, problem);
  }

  async updateProblemStatusById(_id: string, status: UpdateProblemStatusDto): Promise<void>{
    return this.problemRepository.updateProblemStatusById(_id, status);
  }

  async deleteProblemById(_id: string): Promise<void>{
    this.problemRepository.deleteProblemById(_id);
  }

  async compareFlag(_id: string, flag: string): Promise<boolean>{
    const problem = await this.problemRepository.findProblemById(_id);
    
    if(!problem){
      return false;
    }

    return problem.flag === flag;
  }
}

