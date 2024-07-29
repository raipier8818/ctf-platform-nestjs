import { Transform } from "class-transformer";
import { EQUALS, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
export class CreateProfileDto{
  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(20)
  // name: string;

  // @IsNotEmpty()
  // @IsString()
  // organization: string;

  // @IsNotEmpty()
  // @IsString()
  // department: string;

  @IsNotEmpty()
  @IsString()
  account: string;
}

export class UpdateProfileDto {
  @IsString()
  @MaxLength(20)
  name: string;

  @IsString()
  organization: string;

  @IsString()
  department: string;
}

export class ProfileConditionsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  account?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organization?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  department?: string;

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