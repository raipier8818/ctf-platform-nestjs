import { Injectable } from '@nestjs/common';
import { SubmitRepository } from './submit.repository';
import { CreateSubmitDto, SubmitConditionsDto } from './submit.dto';
import { SubmitStatus } from './submit.schema';

@Injectable()
export class SubmitService {
  constructor(
    private readonly submitRepository: SubmitRepository
  ) {}

  async create(createSubmitDto: CreateSubmitDto): Promise<any> {
    return this.submitRepository.create(createSubmitDto);
  }

  async findAll(): Promise<any> {
    return this.submitRepository.findAll();
  }

  async findById(_id: string): Promise<any> {
    return this.submitRepository.findById(_id);
  }

  async findByConditions(conditions: SubmitConditionsDto): Promise<any> {
    return await this.submitRepository.findByConditions(conditions);
  }

  async updateSubmitStatus(_id: string, status: SubmitStatus): Promise<any> {
    return this.submitRepository.updateSubmitStatus(_id, status);
  }
}
