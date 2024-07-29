import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { AuthService } from "./auth.service";
import jwtConfig from "src/config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { AuthPayload } from "./auth.dto";
import { ProfileService } from "src/profile/profile.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,  
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>,
  ){
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {        
          return req?.cookies?.accessToken;
        },
      ]),
      secretOrKey: config.accessTokenOptions.secretKey,
      ignoreExpiration: true,
    })
  }

  async validate(payload: AuthPayload & {exp : number}){ 
    return this.authService.validateAccessToken(payload);
  }
}

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh'){
  constructor(
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>,
  ){
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {                    
          return req?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: config.refreshTokenOptions.secretKey,
      ignoreExpiration: true,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: AuthPayload & { exp: number }) {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return;
    }
    return this.authService.validateRefreshToken(payload, refreshToken);
  }
}

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin'){
  constructor(
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>,
  ){
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {        
          return req?.cookies?.accessToken;
        },
      ]),
      secretOrKey: config.accessTokenOptions.secretKey,
      ignoreExpiration: true,
    })
  }

  async validate(payload: AuthPayload & {exp : number}){
    const { role } = payload;
    if(role !== 'admin'){
      return;
    }

    return this.authService.validateAccessToken(payload);
  }
} 

@Injectable()
export class ManagerStrategy extends PassportStrategy(Strategy, 'manager') {
  constructor(
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.accessToken;
        },
      ]),
      secretOrKey: config.accessTokenOptions.secretKey,
      ignoreExpiration: true,
    })
  }

  async validate(payload: AuthPayload & { exp: number }) {
    const { role } = payload;
    if (role !== 'manager') {
      return;
    }

    return this.authService.validateAccessToken(payload);
  }
} 

