import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class ProblemSubmissionsResponseDto {
  _id: string;
  problem: string;
  panelty: number;
  solved: boolean;
  score: number;
  submittedAt: string[];
}

export class UserScoreResponseDto {
  _id: string;
  profile: string;
  problemSubmissions: ProblemSubmissionsResponseDto[];
}

export class ScoreboardResponseDto {
  _id: string;
  contest: string;
  participants: string[];
  problems: string[];
  userScores: Map<string, UserScoreResponseDto>;
  lastUpdated: string;
}

export class CreateSubmissionDto{
  profile?: string;
  problem?: string;

  @IsNotEmpty()
  @IsString()
  flag: string;

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  score: number;
  
  solved?: boolean;
}

