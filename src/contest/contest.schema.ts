import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ContestDocument = Contest & Document;
export const ContestStatusArr  = ['PENDING', 'RUNNING', 'FINISHED', 'UPCOMING', 'SUSPENDED'] as const;
export type ContestStatus = typeof ContestStatusArr[number];

@Schema()
export class Contest {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: [{type: Types.ObjectId, ref: 'Problem'}], required: true, default: [] })
  problems: Types.ObjectId[];

  @Prop({ type: Date, required: true })
  startTime: Date;

  @Prop({ type: Date, required: true })
  endTime: Date;

  @Prop({ type: String, required: true, default: 'PENDING' })
  status: ContestStatus;

  @Prop({ type: [{type: Types.ObjectId, ref: 'Profile'}], required: true, default: [] })
  participants: Types.ObjectId[];

  @Prop({ type: String, required: true })
  host: string;
}

export const ContestSchema = SchemaFactory.createForClass(Contest);