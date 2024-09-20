import { Transform } from "class-transformer";
import { IsArray, IsDateString, IsEmpty, IsIn, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";
import { ContestStatus, ContestStatusArr } from "./contest.schema";
import { ProblemHeaderResponseDto } from "src/problem/problem.dto";
import { ProfileHeaderResponseDto } from "src/profile/profile.dto";

export class CreateContestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @IsEmpty()
  host?: string;
}

export class UpdateContestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @IsString()
  @IsIn(ContestStatusArr)
  status: ContestStatus;
}


export type ContestSortType = "name" | "startTime" | "endTime" | "host";
export type ContestSortOrder = "asc" | "desc";

export class ContestConditionsRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsPositive()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  endTime?: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sort?: ContestSortType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  order: ContestSortOrder;
}

export class ContestConditionsDto extends ContestConditionsRequestDto{
  status?: ContestStatus[];
}

export class ContestHeaderResponseDto{
  _id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  host: string;
  status: ContestStatus;
}

export class ContestInfoResponseDto extends ContestHeaderResponseDto{
  description: string;
}

export class ContestResponseDto extends ContestInfoResponseDto{
  problems: Array<string>;
  participants: Array<string>;
}

export class PopulatedContestResponseDto extends ContestInfoResponseDto{
  problems: Array<ProblemHeaderResponseDto>;
  participants: Array<ProfileHeaderResponseDto>;
}

export class ContestPageResponseDto{
  limit: number;
  page: number;
  total: number;
  contests: ContestHeaderResponseDto[];
}