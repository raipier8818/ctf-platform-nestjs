import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";
import { Document } from "mongoose";


export type AccountDocument = Account & Document;
export const RoleArr = ['admin', 'user', 'manager'] as const;
export type Role = typeof RoleArr[number];

@Schema()
export class Account {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  ip: string;

  @Prop({ nullable: true})
  @Exclude()
  currentHashedRefreshToken?: string;

  @Prop({ type: String, required: true, default: 'user' })
  role: Role;
}

export const AccountSchema = SchemaFactory.createForClass(Account);