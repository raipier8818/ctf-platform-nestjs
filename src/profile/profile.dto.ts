import { Transform } from "class-transformer";
import { EQUALS, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
export class CreateProfileDto{
  @IsNotEmpty()
  @IsString()
  account: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsString()
  @IsNotEmpty()
  organization: string;

  @IsString()
  @IsNotEmpty()
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


export class ProfileHeaderResponseDto {
  _id: string;
  name: string;
}

export class ProfileInfoResponseDto extends ProfileHeaderResponseDto {
  organization: string;
  department: string;
}

export class ProfileResponseDto extends ProfileInfoResponseDto {
  account: string;
}