import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccountModule } from "src/account/account.module";
import { AdminStrategy, LocalStrategy, ManagerStrategy, RefreshStrategy } from "./jwt.strategy";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "src/config/jwt.config";
import { ProfileModule } from "src/profile/profile.module";

@Module({
  imports: [
    AccountModule,
    ProfileModule,
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule,
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, RefreshStrategy, ManagerStrategy, AdminStrategy],
  exports: [PassportModule, AuthService]
})
export class AuthModule { }