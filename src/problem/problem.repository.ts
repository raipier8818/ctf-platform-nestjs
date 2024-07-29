import { Model, SortOrder } from "mongoose";
import { Problem, ProblemDocument } from "./problem.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CreateProblemDto, ProblemConditions } from "./problem.dto";

export class ProblemRepository{
  constructor(
    @InjectModel(Problem.name) private readonly problemModel: Model<ProblemDocument>,
  ){}
  
  async createProblem(problem: CreateProblemDto){
    try {
      const newProblem = new this.problemModel(problem);
      return await newProblem.save();
    } catch (error) {
      throw error;
    }
  }

  async findProblemById(_id: string, selectFlag = false){
    if(selectFlag){
      return await this.problemModel.findById(_id).exec();
    }
    return await this.problemModel.findById(_id).select("-flag").exec();
  }

  async findProblemByConditions(conditions: ProblemConditions){
    const { page = 1, limit = 10 } = conditions;
    const { sort = "_id", order = "asc" } = conditions;

    const sortOptions: { [key: string]: SortOrder | { $meta: any; }; } = {
      [sort]: (order === "desc" ? -1 : 1)
    }
    delete conditions.page;
    delete conditions.limit;
    delete conditions.sort;
    delete conditions.order;

    return await this.problemModel.find(conditions).sort(sortOptions).skip((page - 1) * limit).limit(limit).select("-flag").exec();
  }

  async updateProblemById(_id: string, problem: Problem){
    return await this.problemModel.findByIdAndUpdate(_id, problem, { new: true });
  }

  async deleteProblemById(_id: string){
    return await this.problemModel.findByIdAndDelete(_id);
  }
}