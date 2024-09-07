import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Contest, ContestDocument } from "./contest.schema";
import { Model, Types } from "mongoose";
import { ContestConditions, ContestInfoResponseDto, ContestResponseDto, CreateContestDto, UpdateContestDto } from "./contest.dto";

@Injectable()
export class ContestRepository {
  constructor(@InjectModel(Contest.name) private contestModel: Model<ContestDocument>) { }
  async createContest(contest: CreateContestDto): Promise<void> {
    const newContest = new this.contestModel(contest);
    await newContest.save();
  }

  async findContestByIdWithProblems(_id: string): Promise<ContestResponseDto>{
    const result = await this.contestModel.findById(_id).populate({
      path: 'problems',
      select: '-flag'
    });

    return {
      _id: result._id.toString(),
      name: result.name,
      description: result.description,
      startTime: result.startTime,
      endTime: result.endTime,
      problems: result.problems,
      participants: result.participants,
      organizer: result.organizer
    }
  }

  async findContestsByConditions(conditions: ContestConditions): Promise<ContestInfoResponseDto[]> {
    const { page = 1, limit = 10 } = conditions;
    const { sort = "_id", order = "asc" } = conditions;

    const sortOptions: { [key: string]: 1 | -1 } = {
      [sort]: (order === "desc" ? -1 : 1)
    }
    delete conditions.page;
    delete conditions.limit;
    delete conditions.sort;
    delete conditions.order;

    const result = await this.contestModel.find(conditions).skip((page - 1) * limit).limit(limit).select('-problems -participants').sort(sortOptions).exec();
    return result.map(contest => {
      return {
        _id: contest._id.toString(),
        name: contest.name,
        description: contest.description,
        startTime: contest.startTime,
        endTime: contest.endTime,
        organizer: contest.organizer
      }
    });
  }

  async findContestById(_id: string): Promise<ContestResponseDto> {
    const result = await this.contestModel.findById(_id);
    return {
      _id: result._id.toString(),
      name: result.name,
      description: result.description,
      startTime: result.startTime,
      endTime: result.endTime,
      problems: result.problems,
      participants: result.participants,
      organizer: result.organizer
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
        organizer: contest.organizer
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