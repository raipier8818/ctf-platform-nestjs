import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { Role, RoleArr } from "src/account/account.schema";

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AuthPayload {
  username: string;
  account: string;
  profile: string;
  role: Role;
}

export type AuthRequest = Request & { user: AuthPayload };