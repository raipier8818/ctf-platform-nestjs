import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Problem } from "src/problem/problem.schema";
import { Profile } from "src/profile/profile.schema";

export type ContestDocument = Contest & Document;
export type ContestStatus = 'RUNNING' | 'FINISHED' | 'UPCOMING' | 'SUSPENDED';

@Schema()
export class Contest {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: [{type: Types.ObjectId, ref: 'Problem'}], required: true, default: [] })
  problems: Problem[];

  @Prop({ type: Date, required: true })
  startTime: Date;

  @Prop({ type: Date, required: true })
  endTime: Date;

  @Prop({ type: String, required: true })
  status: ContestStatus;

  @Prop({ type: [{type: Types.ObjectId, ref: 'Profile'}], required: true, default: [] })
  participants: Profile[];

  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  organizer: Profile;
}

export const ContestSchema = SchemaFactory.createForClass(Contest);