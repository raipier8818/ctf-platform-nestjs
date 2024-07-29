import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto, AuthPayload } from './auth.dto';
import { AccountRepository } from 'src/account/account.repository';
import * as bcrypt from 'bcrypt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { ProfileRepository } from 'src/profile/profile.repository';
import { Profile, ProfileDocument } from 'src/profile/profile.schema';
import { Account, AccountDocument } from 'src/account/account.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>
  ){}

  private generateAccessToken(payload: AuthPayload) {
    return this.jwtService.sign({
      ...payload,
      type: 'access'
    }, { 
      secret: this.config.accessTokenOptions.secretKey,
      expiresIn: this.config.accessTokenOptions.expiresIn
    });
  }

  private generateRefreshToken(payload: AuthPayload) {
    return this.jwtService.sign({
      ...payload,
      type: 'refresh'
    }, { 
      secret: this.config.refreshTokenOptions.secretKey,
      expiresIn: this.config.refreshTokenOptions.expiresIn
    });
  }

  async generateToken(account: AccountDocument, profile: ProfileDocument){
    const payload = new AuthPayload();
    payload.username = account.username
    payload.account = account._id.toString();
    payload.role = account.role;
    if(account.role !== 'admin'){
      payload.profile = profile._id.toString();
    }

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    const getSalt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, getSalt);

    await this.accountRepository.updateHashedRefreshToken(account.username, hashedRefreshToken);

    return { accessToken, refreshToken };
  }

  async login(authCredentialsDto: AuthCredentialsDto){
    const account = await this.accountRepository.findAccountByUsername(authCredentialsDto.username);
    if(!account){
      throw new UnauthorizedException('Invalid credentials');
    }
    if(!bcrypt.compare(authCredentialsDto.password, account.password)){
      throw new UnauthorizedException('Invalid credentials');
    }

    const profile = await this.profileRepository.findProfileByAccount(account._id.toString());

    return this.generateToken(account, profile);
  }

  async logout(username: string){
    await this.accountRepository.deleteHashedRefreshToken(username);
  }

  async refresh(username: string){
    const account = await this.accountRepository.findAccountByUsername(username);
    
    if(!account){
      throw new UnauthorizedException('Unauthorized');
    }

    const payload = new AuthPayload();
    payload.username = account.username
    payload.account = account._id.toString();

    const accessToken = this.generateAccessToken(payload);
    return accessToken;
  }

  async validateAccessToken(payload: AuthPayload & { exp: number }){
    const { username, exp } = payload;
    // console.log(payload);


    if (!username) {
      throw new UnauthorizedException('Unauthorized');
    }

    // const account = await this.accountRepository.findAccountByUsername(username);

    // if (!account) {
    //   throw new UnauthorizedException('Invalid Token');
    // }

    const expDate = new Date(exp * 1000);

    if (expDate < new Date(Date.now())) {
      throw new UnauthorizedException('Expired Token');
    }

    return payload;
  }

  async validateRefreshToken(payload: AuthPayload & { exp: number }, refreshToken: string){
    const { username, exp } = payload;
    // console.log(payload);
    
    const account = await this.accountRepository.findAccountByUsername(username);
    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    const compareRefreshToken = await bcrypt.compare(refreshToken, account.currentHashedRefreshToken);
    
    if (!compareRefreshToken) {
      throw new UnauthorizedException('Invalid Token');
    }

    const expDate = new Date(exp * 1000);

    if (expDate < new Date(Date.now())) {
      throw new UnauthorizedException('Expired Token');
    }

    return payload;
  }
}
