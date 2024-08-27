import { IsArray, IsDateString, IsNotEmpty, IsString, Matches } from "class-validator";

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