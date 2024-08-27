import { Inject, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { CreateAccountDto, DeleteAccountDto, UpdateAccountDto } from './account.dto';
import { AccountRepository } from './account.repository';
import * as bcrypt from 'bcrypt';
import appConfig from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import { Role } from './account.schema';
import { ClientSession } from 'mongoose';

@Injectable()
export class AccountService implements OnModuleInit {
  constructor(
    private readonly accountRepository: AccountRepository,
    @Inject(appConfig.KEY) private readonly config: ConfigType<typeof appConfig>
  ){}

  async onModuleInit(){
    const admin = await this.accountRepository.findAccountByUsername('admin');
    // console.log(this.config);
    
    if(!admin){
      const adminAccount: CreateAccountDto = {...this.config.admin, confirmPassword: this.config.admin.password};
      await this.register(adminAccount, 'admin');
    }
  }

  async register(createAccountDto: CreateAccountDto, role: Role = 'user', session?: ClientSession) {
    const { username, email, password, confirmPassword } = createAccountDto;
    if(password.localeCompare(confirmPassword) !== 0){
      throw new UnauthorizedException('Password and Confirm Password must be the same');
    }

    const existingUsername = await this.accountRepository.findAccountByUsername(username);
    if(existingUsername){
      throw new UnauthorizedException('Username already exists');
    }

    const existingEmail = await this.accountRepository.findAccountByEmail(email);
    if(existingEmail){
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    createAccountDto.password = hashedPassword;
    createAccountDto.role = role;

    return await this.accountRepository.createAccount(createAccountDto, session);
  }

  async deleteAccount(_id: string, deleteAccountDto: DeleteAccountDto, session?: ClientSession) {
    const { password, confirmPassword } = deleteAccountDto;
    if(password.localeCompare(confirmPassword) !== 0){
      throw new UnauthorizedException('Password and Confirm Password must be the same');
    }
    const account = await this.accountRepository.findAccountById(_id);
    if(!account){
      throw new NotFoundException('Invalid username');
    }
    
    const isPasswordMatch = await bcrypt.compare(password, account.password);

    if(!isPasswordMatch){
      throw new UnauthorizedException('Invalid password');
    }

    return await this.accountRepository.deleteAccount(_id);
  }

  async deleteAccountAdmin(_id: string, session?: ClientSession) {
    return await this.accountRepository.deleteAccount(_id, session);
  }

  async changePassword(_id: string, updateAccountDto: UpdateAccountDto) {
    const { password, confirmPassword, newPassword } = updateAccountDto;
    if (password.localeCompare(confirmPassword) !== 0) {
      throw new UnauthorizedException('Password and Confirm Password must be the same');
    }

    if(password.localeCompare(newPassword) === 0){
      throw new UnauthorizedException('New password must be different from the old password');
    }

    const account = await this.accountRepository.findAccountById(_id);
    const isPasswordMatch = await bcrypt.compare(password, account.password);

    if(!isPasswordMatch){
      throw new UnauthorizedException('Invalid password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    updateAccountDto.newPassword = hashedPassword;

    return await this.accountRepository.updatePassword(_id, updateAccountDto);
  }

  async findAccountByUsername(username: string){
    return await this.accountRepository.findAccountByUsername(username);
  }

  async findAccountByEmail(email: string){
    return await this.accountRepository.findAccountByEmail(email);
  }

  async findAllAccounts(){
    return await this.accountRepository.findAllAccounts();
  }
}
