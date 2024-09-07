import { Transform } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsPositive, IsString, Matches } from "class-validator";

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
}


export type ContestSortType = "name" | "startTime" | "endTime";
export type ContestSortOrder = "asc" | "desc";

export class ContestConditions {
  @IsString()
  @IsNotEmpty()
  name: string;

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
  sort?: ContestSortType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  order: ContestSortOrder;
}

export class ContestInfoResponseDto{
  _id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  organizer: string;
}

export class ContestResponseDto extends ContestInfoResponseDto{
  problems: Array<string>;
  participants: Array<string>;
}