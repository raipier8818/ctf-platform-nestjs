import { Body, Controller, Delete, Get, HttpException, InternalServerErrorException, Logger, Param, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto, DeleteAccountDto, UpdateAccountDto } from './account.dto';
import { AdminAuthGuard, LocalAuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';
import { AuthRequest } from 'src/auth/auth.dto';
import { ProfileService } from 'src/profile/profile.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(
    private readonly accountService: AccountService,
    private readonly profileService: ProfileService,
    @InjectConnection() private readonly connection: Connection
  ) { }
  
  @Post()
  async register(@Body() createAccountDto: CreateAccountDto){
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const account = await this.accountService.register(createAccountDto, 'user', session);
      const profile = await this.profileService.createProfileByAccountId(account._id.toString(), session);
    
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      
      throw new InternalServerErrorException('Failed to register account');
    }

    session.endSession();
  }

  @Post('manager')
  @UseGuards(AdminAuthGuard)
  async registerManager(@Body() createAccountDto: CreateAccountDto, @Req() req: AuthRequest) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const account = await this.accountService.register(createAccountDto, 'manager', session);
      const profile = await this.profileService.createProfileByAccountId(account._id.toString(), session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.log(error);

      throw new InternalServerErrorException('Failed to register account');
    }

    session.endSession();
  }


  @Delete()
  @UseGuards(LocalAuthGuard)
  async deleteOwnAccount(@Body() deleteAccountDto: DeleteAccountDto, @Req() req: AuthRequest, @Res({ passthrough: true }) res: Response){
    const { account } = req.user;

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      await this.profileService.deleteProfileByAccountId(account, session);
      await this.accountService.deleteAccount(account, deleteAccountDto, session);
  
      await session.commitTransaction();

    } catch (error) {
      await session.abortTransaction();
      throw new InternalServerErrorException('Failed to delete account');
    } finally {
      session.endSession();
    }
    
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  @Delete(':username')
  @UseGuards(AdminAuthGuard)
  async deleteAccount(@Param('username') username: string, @Req() req: AuthRequest){
    const account = await this.accountService.findAccountByUsername(username);
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      await this.profileService.deleteProfileByAccountId(account._id.toString(), session);
      await this.accountService.deleteAccountAdmin(account._id.toString(), session);

      await session.commitTransaction();

    } catch (error) {
      await session.abortTransaction();
      throw new InternalServerErrorException('Failed to delete account');
    } finally {
      session.endSession();
    }
  }

  @Put('password')
  @UseGuards(LocalAuthGuard)
  async changePassword(@Body() updateAccountDto: UpdateAccountDto, @Req() req: AuthRequest){
    const { account } = req.user;
    await this.accountService.changePassword(account, updateAccountDto);
  }

  // @Get()
  // @UseGuards(LocalAuthGuard)
  // async findAccountByUsername(@Req() req: any){
  //   const { username } = req.user;
  //   return await this.accountService.findAccountByUsername(username);
  // }

  @Get()
  @UseGuards(AdminAuthGuard)
  async findAllAccountsInfo(){
    return await this.accountService.findAllAccounts();
  }
}
