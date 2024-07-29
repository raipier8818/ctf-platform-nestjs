import { SubmitService } from './submit.service';
import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateSubmitDto, SubmitConditionsDto } from './submit.dto';
import { LocalAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/auth.dto';

@Controller('submit')
export class SubmitController {
  constructor(
    private readonly submitService: SubmitService
  ) {}

  @Get()
  async findByConditions(@Query() conditions: SubmitConditionsDto) {
    return this.submitService.findByConditions(conditions);
  }

  @Post()
  @UseGuards(LocalAuthGuard)
  async create(@Body() CreateSubmitDto: CreateSubmitDto, @Req() req: AuthRequest) {
    CreateSubmitDto.profile = req.user.profile;
    return this.submitService.create(CreateSubmitDto);
  }
}