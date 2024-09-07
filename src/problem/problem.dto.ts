import { Transform } from "class-transformer";
import { ProblemDifficulty, ProblemDifficultyArr, ProblemDomain, ProblemDomainArr, ProblemStatus, ProblemStatusArr } from "./problem.schema";
import { IsEmpty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateProblemDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsNotEmpty()
  @IsString()
  description: string;
  
  @IsNotEmpty()
  @IsString()
  flag: string;
  
  @IsNotEmpty()
  @IsString()
  uri: string;
  
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  score: number;
  
  @IsNotEmpty()
  @IsString()
  @IsIn(ProblemDomainArr)
  domain: ProblemDomain;
  
  @IsNotEmpty()
  @IsString()
  @IsIn(ProblemDifficultyArr)
  difficulty: ProblemDifficulty;
}

export class UpdateProblemDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  flag: string;

  @IsNotEmpty()
  @IsString()
  uri: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  score: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(ProblemDomainArr)
  domain: ProblemDomain;

  @IsNotEmpty()
  @IsString()
  @IsIn(ProblemDifficultyArr)
  difficulty: ProblemDifficulty;

  @IsNotEmpty()
  @IsString()
  @IsIn(ProblemStatusArr)
  status: ProblemStatus;
}

export class SubmitFlagDto {
  @IsNotEmpty()
  @IsString()
  flag: string;
}

export class ProblemConditions {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  domain?: ProblemDomain;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  difficulty?: ProblemDifficulty;
  
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsPositive()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sort?: ProblemSortType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  order: ProblemSortOrder;

  @IsEmpty()
  status?: ProblemStatus;
};

export interface ProblemHeaderResponseDto {
  _id: string;
  name: string;
  domain: ProblemDomain;
  difficulty: ProblemDifficulty;
  status: ProblemStatus;
}

export interface ProblemInfoResponseDto extends ProblemHeaderResponseDto {
  description: string;
  uri: string;
  score: number;
}

export interface ProblemResponseDto extends ProblemInfoResponseDto {
  flag: string;
}

export interface ProblemPageResponseDto {
  problems: ProblemHeaderResponseDto[];
  total: number
  page: number;
  limit: number;
}

export type ProblemSortType = "name" | "domain" | "difficulty";
export type ProblemSortOrder = "asc" | "desc";
