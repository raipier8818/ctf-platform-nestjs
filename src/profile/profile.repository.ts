import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Profile, ProfileDocument } from "./profile.schema";
import { ClientSession, Model, SortOrder, Types } from "mongoose";
import { CreateProfileDto, ProfileConditionsDto, UpdateProfileDto } from "./profile.dto";


@Injectable()
export class ProfileRepository {
  constructor(@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>) { }

  async createProfile(account: string, session?: ClientSession) {
    const newProfile = new this.profileModel({account: new Types.ObjectId(account)});
    return await newProfile.save({ session });
  }

  async findProfileById(_id: string){
    try{
      return await this.profileModel.findById(new Types.ObjectId(_id)).select('-account');
    }catch(e){
      console.log(e);
      return null;
    }
  }

  async findProfileByAccount(_id: string): Promise<ProfileDocument> {
    try{
      return await this.profileModel.findOne({ account: new Types.ObjectId(_id) }).select('-account');
    }catch(e){
      console.log(e);
      return null;
    }
  }

  async findProfileByConditions(conditions: ProfileConditionsDto): Promise<ProfileDocument[]> {
    const { page = 1, limit = 10 } = conditions;
    const { sort = "createdAt", order = "desc" } = conditions;

    const sortOptions: { [key: string]: SortOrder | { $meta: any; }; } = {
      [sort]: (order === "desc" ? -1 : 1)
    }
    delete conditions.page;
    delete conditions.limit;
    delete conditions.sort;
    delete conditions.order;

    return await this.profileModel.find(conditions).sort(sortOptions).skip((page - 1) * limit).limit(limit).select("-account").exec();
  }

  async updateProfileById(_id: string, updateProfileDto: UpdateProfileDto){
    return await this.profileModel.findByIdAndUpdate(new Types.ObjectId(_id), updateProfileDto, { new: true });
  }

  async updateProfileByAccountId(_id: string, updateProfileDto: UpdateProfileDto){
    return await this.profileModel.findOneAndUpdate({ account: new Types.ObjectId(_id) }, updateProfileDto, { new: true });
  }
  
  async deleteProfileById(_id: string){
    return await this.profileModel.findByIdAndDelete(new Types.ObjectId(_id));
  }

  async deleteProfileByAccountId(_id: string, session?: ClientSession){
    return await this.profileModel.findOneAndDelete({ account: new Types.ObjectId(_id) }).session(session);
  }

  async addSolvedProblem(_id: string, problem: string){
    return await this.profileModel.findByIdAndUpdate(new Types.ObjectId(_id), { $push: { solvedProblems: new Types.ObjectId(problem) } }, { new: true });
  }
}