import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Contest, ContestDocument } from "./contest.schema";
import { Model, Types } from "mongoose";
import { CreateContestDto, UpdateContestDto } from "./contest.dto";

@Injectable()
export class ContestRepository {
  constructor(@InjectModel(Contest.name) private contestModel: Model<ContestDocument>) { }
  async createContest(contest: CreateContestDto) {
    const newContest = new this.contestModel(contest);
    return await newContest.save();
  }

  async findContestByIdWithProblems(_id: string) {
    return await this.contestModel.findById(_id).populate({
      path: 'problems',
      select: '-flag'
    });
  }

  async findContestById(_id: string) {
    return await this.contestModel.findById(_id);
  }

  async findAllContests() {
    return await this.contestModel.find();
  }

  async updateContestById(_id: string, contest: UpdateContestDto) {
    return await this.contestModel.findByIdAndUpdate(_id, contest, { new: true });
  }

  async deleteContestById(_id: string) {
    return await this.contestModel.findByIdAndDelete(_id);
  }

  async updateProblemInContest(_id: string, newProblems: Array<string>) {
    const newProblemsObjectIds = newProblems.map(problem => new Types.ObjectId(problem));
    return await this.contestModel.findByIdAndUpdate(_id, { problems: newProblemsObjectIds }, { new: true });
  }

  async pushParticipantInContest(_id: string, profile: string) {
    return await this.contestModel.findByIdAndUpdate(_id, { $push: { participants: profile } }, { new: true });
  }

  async popParticipantInContest(_id: string, profile: string) {
    return await this.contestModel.findByIdAndUpdate(_id, { $pull: { participants: profile } }, { new: true });
  }
}