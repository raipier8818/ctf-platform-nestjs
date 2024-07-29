import { Transform } from "class-transformer";
import { ProblemDifficulty, ProblemDifficultyArr, ProblemDomain, ProblemDomainArr } from "./problem.schema";
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

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
  sort?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  order: string;
};