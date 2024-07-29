import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Submit, SubmitDocument } from "./submit.schema";
import { CreateSubmitDto, SubmitConditionsDto } from "./submit.dto";
import { Model, SortOrder } from "mongoose";

@Injectable()
export class SubmitRepository{
  constructor(
    @InjectModel(Submit.name) private submitModel: Model<SubmitDocument>
  ) {}

  async create(createSubmitDto: CreateSubmitDto): Promise<Submit> {
    const newSubmit = new this.submitModel(createSubmitDto);
    return newSubmit.save();
  }

  async findAll(): Promise<Submit[]> {
    return this.submitModel.find().exec();
  }

  async findById(_id: string): Promise<Submit> {
    return this.submitModel.findById(_id).exec();
  }

  async findByConditions(conditions: SubmitConditionsDto) {
    const { page = 1, limit = 10 } = conditions;
    const { sort = "createdAt", order = "desc" } = conditions;

    const sortOptions: { [key: string]: SortOrder | { $meta: any; }; } = {
      [sort]: (order === "desc" ? -1 : 1)
    }
    delete conditions.page;
    delete conditions.limit;
    delete conditions.sort;
    delete conditions.order;

    return await this.submitModel.find(conditions).sort(sortOptions).skip((page - 1) * limit).limit(limit).select("-flag").exec();
  }

  async updateSubmitStatus(_id: string, status: string): Promise<Submit> {
    return this.submitModel.findByIdAndUpdate(_id, { status });
  }
}