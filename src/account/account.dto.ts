import { IsEmpty, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(4)
  // @Matches(/^[a-zA-Z0-9]*$/, { message: 'Username can only contain letters and numbers' })  
  username: string;
  
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: 'Password too weak' })
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;


  @IsNotEmpty()
  @IsString()
  // @Matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, { message: 'Invalid email' })
  email: string;

  @IsEmpty()
  role: string;
}

export class UpdateAccountDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class DeleteAccountDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}