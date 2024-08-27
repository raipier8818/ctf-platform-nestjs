import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto, AuthRequest } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard, RefreshAuthGuard } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}

  @Get()
  @UseGuards(LocalAuthGuard)
  async auth(@Req() req: AuthRequest){
    return {
      profile: req.user.profile,
      role: req.user.role
    }
  }

  @Post('login')
  async login(@Res({ passthrough : true }) res: Response, @Body() authCredentialsDto: AuthCredentialsDto){
    const { accessToken, refreshToken } = await this.authService.login(authCredentialsDto);
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
  }

  @Post('logout')
  @UseGuards(LocalAuthGuard)
  async logout(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response): Promise<void>{
    const { username } = req.user;

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return this.authService.logout(username);
  }

  @Get('test')
  @UseGuards(LocalAuthGuard)
  async test(){
    try {
      return 'test';
    } catch (error) {
      return error;
    }
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  async refresh(@Req() req: AuthRequest, @Res({ passthrough : true}) res: Response): Promise<void>{
    const { username } = req.user;
    const accessToken = await this.authService.refresh(username);   
    res.cookie('accessToken', accessToken, { httpOnly: true });
  }
}
