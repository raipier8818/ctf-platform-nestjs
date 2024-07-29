import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Contest } from "src/contest/contest.schema";
import { Problem } from "src/problem/problem.schema";
import { Profile } from "src/profile/profile.schema";

export type SubmitDocument = Submit & Document;
export const SubmitStatusArr = ['PENDING', 'ACCEPTED', 'WRONG', 'REJECTED'];
export type SubmitStatus = typeof SubmitStatusArr[number];


@Schema()
export class Submit {
  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  profile: Profile;

  @Prop({ type: Types.ObjectId, ref: 'Problem', required: true })
  problem: Problem;

  @Prop({ type: Types.ObjectId, ref: 'Contest', required: false })
  contest: Contest;

  @Prop({ type: String, required: true })
  flag: string;

  @Prop({ type: String, required: true, default: 'PENDING' })
  status: SubmitStatus;

  @Prop({ type: Date, default: Date.now, required: true })
  createdAt: Date;
}

export const SubmitSchema = SchemaFactory.createForClass(Submit);