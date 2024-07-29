import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Account, AccountDocument } from "./account.schema";
import { ClientSession, Model, Types } from "mongoose";
import { CreateAccountDto, DeleteAccountDto, UpdateAccountDto } from "./account.dto";

@Injectable()
export class AccountRepository {
  constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>){}

  async createAccount(createAccountDto: CreateAccountDto, session?: ClientSession) {
    const newAccount = new this.accountModel(createAccountDto);
    return await newAccount.save({ session});
  }

  async findAccountById(_id: string) {
    return await this.accountModel.findById(new Types.ObjectId(_id));
  }

  async findAccountByUsername(username: string) {
    return await this.accountModel.findOne({ username });
  }

  async findAccountByEmail(email: string) {
    return await this.accountModel.findOne({ email });
  }

  async updatePassword(_id: string, updatePassword: UpdateAccountDto) {
    return await this.accountModel.findByIdAndUpdate(new Types.ObjectId(_id), updatePassword, { new: true });
  }

  async deleteAccount(_id: string, session?: ClientSession) {
    if(session){
      return await this.accountModel.findByIdAndDelete(new Types.ObjectId(_id)).session(session);
    }

    return await this.accountModel.findByIdAndDelete(new Types.ObjectId(_id));
  }

  async updateHashedRefreshToken(username: string, hashedRefreshToken: string) {
    return await this.accountModel.findOneAndUpdate({ username }, { currentHashedRefreshToken: hashedRefreshToken });
  }

  async deleteHashedRefreshToken(username: string) {
    return await this.accountModel.findOneAndUpdate({ username }, { currentHashedRefreshToken: null });
  }
}