import { Injectable } from '@nestjs/common';
import { ProblemRepository } from './problem.repository';
import { CreateProblemDto, ProblemConditions } from './problem.dto';

@Injectable()
export class ProblemService {
  constructor(
    private readonly problemRepository: ProblemRepository
  ) {} 

  async createProblem(problem: CreateProblemDto){
    return this.problemRepository.createProblem(problem);
  }

  async findProblemById(_id: string){
    return this.problemRepository.findProblemById(_id);
  }

  async findProblemByIds(ids: Array<string>){
    return this.problemRepository.findProblemByIds(ids);
  }

  async findProblemByConditions(conditions: ProblemConditions){
    return this.problemRepository.findProblemByConditions(conditions);
  }

  async updateProblemById(_id: string, problem: any){
    return this.problemRepository.updateProblemById(_id, problem);
  }

  async deleteProblemById(_id: string){
    return this.problemRepository.deleteProblemById(_id);
  }

  async compareFlag(_id: string, flag: string){
    const problem = await this.problemRepository.findProblemById(_id, true);
    
    if(!problem){
      return false;
    }

    return problem.flag === flag;
  }
}

