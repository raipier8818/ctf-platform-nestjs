import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Account } from "src/account/account.schema";
import { Problem } from "src/problem/problem.schema";

export type ProfileDocument = Profile & Document;


@Schema()
export class Profile {
  @Prop({ type: Types.ObjectId, ref: 'Account', required: true, unique: true })
  account: Account;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  organization: string;

  @Prop({ type: String })
  department: string;

  @Prop({ type: [{type: Types.ObjectId, ref: 'Problem'}], required: true, default: [] })
  solvedProblems: Problem[];

  @Prop({ type: Boolean, required: true, default: false })
  initialized: boolean;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);