import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Contest, ContestDocument } from "./contest.schema";
import { Model } from "mongoose";
import { CreateContestDto, UpdateContestDto } from "./contest.dto";

@Injectable()
export class ContestRepository {
  constructor(@InjectModel(Contest.name) private contestModel: Model<ContestDocument>) { }
  async createContest(contest: CreateContestDto) {
    const newContest = new this.contestModel(contest);
    return await newContest.save();
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

  async pushProblemToContest(_id: string, problem: string) {
    return await this.contestModel.findByIdAndUpdate(_id, { $push: { problems: problem } }, { new: true });
  }
  
  async popProblemFromContest(_id: string, problem: string) {
    return await this.contestModel.findByIdAndUpdate(_id, { $pull: { problems: problem } }, { new: true });
  }

  async pushParticipantToContest(_id: string, profile: string) {
    return await this.contestModel.findByIdAndUpdate(_id, { $push: { participants: profile } }, { new: true });
  }

  async popParticipantFromContest(_id: string, profile: string) {
    return await this.contestModel.findByIdAndUpdate(_id, { $pull: { participants: profile } }, { new: true });
  }
}