import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ProblemDocument = Problem & Document;

export const ProblemDomainArr = ['PWN', 'REVERSE', 'WEB', 'FORENSIC', 'MISC'] as const;
export type ProblemDomain = typeof ProblemDomainArr[number];

export const ProblemDifficultyArr = ['EASY', 'MEDIUM', 'HARD', 'INSANE'] as const;
export type ProblemDifficulty = typeof ProblemDifficultyArr[number];

export const ProblemStatusArr = ['ACCEPTED', 'REJECTED', 'PENDING'] as const;
export type ProblemStatus = typeof ProblemStatusArr[number];


@Schema()
export class Problem {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  // @Prop({ type: String, required: true })
  // filepath: string;

  @Prop({ type: String, required: true })
  flag: string;
  
  @Prop({ type: String, required: true })
  uri: string;

  @Prop({ type: Number, required: true })
  score: number;

  @Prop({ type: String, required: true })
  domain: ProblemDomain;

  @Prop({ type: String, required: true })
  difficulty: ProblemDifficulty;

  @Prop({ type: Number, required: true, default: 0})
  solved: number;

  @Prop({ type: Number, required: true, default: 0})
  attempts: number;

  @Prop({ type: String, required: true, default: 'PENDING' })
  status: ProblemStatus;
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);