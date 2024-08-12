import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

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