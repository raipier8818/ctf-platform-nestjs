import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Contest, ContestDocument } from "./contest.schema";
import { Model, Types } from "mongoose";
import { ContestConditionsRequestDto, ContestConditionsDto, ContestInfoResponseDto, ContestPageResponseDto, PopulatedContestResponseDto, ContestResponseDto, CreateContestDto, UpdateContestDto } from "./contest.dto";
import { ProblemHeaderResponseDto, ProblemResponseDto } from "src/problem/problem.dto";
import { Problem, ProblemDocument } from "src/problem/problem.schema";
import { Profile, ProfileDocument } from "src/profile/profile.schema";

@Injectable()
export class ContestRepository {
  constructor(@InjectModel(Contest.name) private contestModel: Model<ContestDocument>) { }
  async createContest(contest: CreateContestDto): Promise<void> {
    const newContest = new this.contestModel(contest);
    await newContest.save();
  }

  async findPopulatedContestById(_id: string): Promise<PopulatedContestResponseDto> {
    const result: any /* fucking typscript */ = await this.contestModel.findById(_id)
      .populate<Problem>({
        path: 'problems',
        model: Problem.name,
      })
      .populate<Profile>({
        path: 'participants',
        model: Profile.name,
      })
      .exec();
    console.log(result);
    

    const populated: PopulatedContestResponseDto = {
      _id: result._id.toString(),
      name: result.name,
      description: result.description,
      startTime: result.startTime,
      endTime: result.endTime,
      problems: result.problems.map((problem: any) => {
        return {
          _id: problem._id.toString(),
          name: problem.name,
          domain: problem.domain,
          difficulty: problem.difficulty,
          status: problem.status
        }
      }),
      participants: result.participants.map((participant: any) => {
        return {
          _id: participant._id.toString(),
          name: participant.name
        }
      }),
      host: result.host,
      status: result.status
    }
    return populated;
  }  
  async findContestsByConditions(conditions: ContestConditionsDto): Promise<ContestPageResponseDto> {
    const { page = 1, limit = 10 } = conditions;
    const { sort = "_id", order = "asc" } = conditions;

    const sortOptions: { [key: string]: 1 | -1 } = {
      [sort]: (order === "desc" ? -1 : 1)
    }
    delete conditions.page;
    delete conditions.limit;
    delete conditions.sort;
    delete conditions.order;

    const query = this.contestModel.find({
      name: conditions.name ? { $regex: conditions.name, $options: "i" } : { $exists: true },
    }).sort(sortOptions);

    const total = await this.contestModel.countDocuments(query);
    const result = await query.skip((page - 1) * limit).limit(limit);

    return {
      limit,
      page,
      total,
      contests: result.map((contest: ContestDocument) => {
        return {
          _id: contest._id.toString(),
          name: contest.name,
          description: contest.description,
          startTime: contest.startTime,
          endTime: contest.endTime,
          host: contest.host,
          status: contest.status
        }
      })
    } ;
  }

  async findContestById(_id: string): Promise<ContestResponseDto> {
    const result = await this.contestModel.findById(_id);
    return {
      _id: result._id.toString(),
      name: result.name,
      description: result.description,
      startTime: result.startTime,
      endTime: result.endTime,
      problems: result.problems.map(problem => problem.toString()),
      participants: result.participants.map(participant => participant.toString()),
      host: result.host,
      status: result.status
    }
  }

  async findAllContests(): Promise<ContestInfoResponseDto[]> {
    const result = await this.contestModel.find().select('-problems -participants');
    return result.map(contest => {
      return {
        _id: contest._id.toString(),
        name: contest.name,
        description: contest.description,
        startTime: contest.startTime,
        endTime: contest.endTime,
        host: contest.host,
        status: contest.status
      }
    });
  }

  async updateContestById(_id: string, contest: UpdateContestDto): Promise<void> {
    await this.contestModel.findByIdAndUpdate(_id, contest, { new: true });
  }

  async deleteContestById(_id: string): Promise<void> {
    await this.contestModel.findByIdAndDelete(_id);
  }

  async updateProblemInContest(_id: string, newProblems: Array<string>): Promise<void> {
    const newProblemsObjectIds = newProblems.map(problem => new Types.ObjectId(problem));
    await this.contestModel.findByIdAndUpdate(_id, { problems: newProblemsObjectIds }, { new: true });
  }

  async pushParticipantInContest(_id: string, profile: string): Promise<void> {
    await this.contestModel.findByIdAndUpdate(_id, { $push: { participants: profile } }, { new: true });
  }

  async popParticipantInContest(_id: string, profile: string): Promise<void> {
    await this.contestModel.findByIdAndUpdate(_id, { $pull: { participants: profile } }, { new: true });
  }

  async removeProblemFromContest(_id: string, problem: string): Promise<void> {
    await this.contestModel.updateMany(
      { problems: new Types.ObjectId(problem) },
      { $pull: { problems: new Types.ObjectId(problem) } }
    )
  }
}