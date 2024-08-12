import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ScoreboardDocument = Scoreboard & Document;

@Schema()
export class ProblemSubmissions {
  @Prop({ type: Types.ObjectId, ref: 'Problem', required: true, unique: true })
  problem: Types.ObjectId;

  @Prop({ type: Number, required: true })
  panelty: number;

  @Prop({ type: Boolean, required: true })
  solved: boolean;

  @Prop({ type: Number, required: true })
  score: number;

  @Prop({ type: [{ type: Date }], required: true, default: [] })
  submittedAt: Date[];
}

export const SubmissionSchema = SchemaFactory.createForClass(ProblemSubmissions);

@Schema()
export class UserScore {
  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true, unique: true })
  profile: Types.ObjectId;

  @Prop({ type: Map, of: SubmissionSchema, required: true, default: {} })
  problemSubmissions: Map<Types.ObjectId, ProblemSubmissions>;
}

export const UserScoreSchema = SchemaFactory.createForClass(UserScore);

@Schema()
export class Scoreboard {
  @Prop({ type: Types.ObjectId, ref: 'Contest', required: true, unique: true })
  contest: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId }], ref: 'Profile', required: true, unique: true })
  participants: string[];

  @Prop({ type: [{ type: Types.ObjectId }], ref: 'Problem', required: true, unique: true })
  problems: string[];

  @Prop({ type: Map, of: UserScoreSchema, required: true, default: {} })
  userScores: Map<Types.ObjectId, UserScore>;

  @Prop({ type: Date, required: true, default: Date.now })
  lastUpdated: Date;
}

export const ScoreboardSchema = SchemaFactory.createForClass(Scoreboard);