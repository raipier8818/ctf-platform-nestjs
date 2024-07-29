import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateSubmitDto {
  profile: String;

  @IsNotEmpty()
  @IsString()
  problem: String;

  @IsNotEmpty()
  @IsString()
  flag: string;
}



export class SubmitConditionsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  profile?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  problem?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contest?: string;

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
}