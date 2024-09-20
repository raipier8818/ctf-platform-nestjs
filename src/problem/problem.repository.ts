import { Model, SortOrder, Types } from "mongoose";
import { Problem, ProblemDocument } from "./problem.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CreateProblemDto, ProblemConditions, ProblemHeaderResponseDto, ProblemInfoResponseDto, ProblemPageResponseDto, ProblemResponseDto, UpdateProblemDto, UpdateProblemStatusDto } from "./problem.dto";

export class ProblemRepository{
  constructor(
    @InjectModel(Problem.name) private readonly problemModel: Model<ProblemDocument>,
  ){}
  
  async createProblem(problem: CreateProblemDto): Promise<void>{
    try {
      const newProblem = new this.problemModel(problem);
      await newProblem.save();
    } catch (error) {
      throw error;
    }
  }

  async findProblemById(_id: string): Promise<ProblemResponseDto>{
    const query = this.problemModel.findById(new Types.ObjectId(_id));
    const result = await query.exec();
    return {
      _id: result._id.toString(),
      name: result.name,
      description: result.description,
      uri: result.uri,
      score: result.score,
      domain: result.domain,
      difficulty: result.difficulty,
      status: result.status,
      flag: result.flag,
    }
  }

  async findAllProblems(): Promise<ProblemHeaderResponseDto[]>{
    const result = await this.problemModel.find({ status: 'ACCEPTED' }).select("-flag").exec();
    return result.map(problem => {
      return {
        _id: problem._id.toString(),
        name: problem.name,
        domain: problem.domain,
        difficulty: problem.difficulty,
        status: problem.status
      }
    });
  }

  async findProblemsByConditions(conditions: ProblemConditions): Promise<ProblemPageResponseDto>{
    const { page = 1, limit = 10 } = conditions;
    const { sort = "_id", order = "asc" } = conditions;

    const sortOptions: { [key: string]: SortOrder | { $meta: any; }; } = {
      [sort]: (order === "desc" ? -1 : 1)
    }
    delete conditions.page;
    delete conditions.limit;
    delete conditions.sort;
    delete conditions.order;

    const result = await this.problemModel.find(conditions).skip((page - 1) * limit).limit(limit).select("-flag").sort(sortOptions).exec();
    const total = await this.problemModel.countDocuments(conditions);
    return {
      limit,
      page,
      total,
      problems: result.map(problem => {
        return {
          _id: problem._id.toString(),
          name: problem.name,
          domain: problem.domain,
          difficulty: problem.difficulty,
          status: problem.status
        }
      })
    };
  }

  async findProblemInfoById(_id: string): Promise<ProblemInfoResponseDto>{
    const query = this.problemModel.findById(new Types.ObjectId(_id));
    const result = await query.exec();
    return {
      _id: result._id.toString(),
      name: result.name,
      description: result.description,
      uri: result.uri,
      score: result.score,
      domain: result.domain,
      difficulty: result.difficulty,
      status: result.status,
    }
  }


  async updateProblemById(_id: string, problem: UpdateProblemDto): Promise<void>{
    return await this.problemModel.findByIdAndUpdate(_id, problem, { new: false });
  }

  async updateProblemStatusById(_id: string, status: UpdateProblemStatusDto): Promise<void>{
    return await this.problemModel.findByIdAndUpdate(_id, { status }, { new: false });
  }

  async deleteProblemById(_id: string){
    return await this.problemModel.findByIdAndDelete(_id);
  }
}