import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import * as dayjs from 'dayjs';

export type CreditInfoDocument = HydratedDocument<CreditInfo>;

export interface ICreditInfo {
  eligibility: boolean;
  creditAmt: number;
  interestRate: number;
  dueDate: Date;
  isPaid: boolean;
  usedCredit: number;
  remainingCredit: number;
  userId: User;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class CreditInfo {
  @Prop({ required: true })
  creditAmt: number;

  @Prop({ default: 0.05 })
  interestRate: number;

  @Prop()
  dueDate: Date;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ default: 0 })
  usedCredit: number;

  @Prop({ required: true })
  remainingCredit: number;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  userId: User;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  createdBy: User;
}

export const CreditInfoSchema = SchemaFactory.createForClass(CreditInfo);
