import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, ProfileConditionsDto, UpdateProfileDto } from './profile.dto';
import { LocalAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/auth.dto';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  // @Post()
  // @UseGuards(LocalAuthGuard)
  // async createProfile(@Req() req: AuthRequest, @Body() createProfileDto: CreateProfileDto){
  //   const { account } = req.user;
    
  //   return await this.profileService.createProfileByAccountId(account, createProfileDto);
  // }

  @Get()
  @UseGuards(LocalAuthGuard)
  async findOwnProfile(@Req() req: AuthRequest) {
    const { account } = req.user;
    
    return this.profileService.findProfileByAccount(account);
  }

  @Get()
  async findProfileByConditions(@Query() conditions: ProfileConditionsDto){
    return this.profileService.findProfileByConditions(conditions);
  }

  @Put()
  @UseGuards(LocalAuthGuard)
  async updateOwnProfile(@Req() req: AuthRequest, @Body() updateProfileDto: UpdateProfileDto){
    const { account } = req.user;
    return this.profileService.updateProfileByAccountId(account, updateProfileDto);
  }

  // @Delete()
  // @UseGuards(LocalAuthGuard)
  // async deleteOwnProfile(@Req() req: AuthRequest){
  //   const { account } = req.user;
  //   return this.profileService.deleteProfileByAccountId(account);
  // }
}
