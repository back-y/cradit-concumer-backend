import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { CreditStatus } from './credit-status.enum';
import { orderItems } from 'src/order/dto/create-order.dto';

export type CreditDocument = HydratedDocument<Credit>;

export class Comments  {
  @Prop({ required: true, default: '' })
  title: string;

  @Prop({ required: true, default: '' })
  body: string;

  @Prop({ required: true, default: '' })
  commentedBy: string;
}

@Schema({ timestamps: true })
export class Credit  {
  @Prop({ required: true })
  totalPrice: number;

  @Prop({required:false})
  withInterest:number

  @Prop({ required: false })
  createdAt: Date;

  @Prop({ required: true, default: CreditStatus.NOT_PAID })
  status: CreditStatus;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop()
  creditInfoId: string;

  @Prop()
  orderId: string;

  @Prop({required: true})
  editOrderId: string;

  @Prop({ default: false })
  isDelivered: boolean;

  @Prop({ required: true })
  products: Array<orderItems>;

  @Prop()
  paidDate: Date;

  @Prop({required: true, default: [{title: '', body:'', commentedBy: ''}]})
  comments: Comments[];

  @Prop({required: false, default: 0 })
  paidAmount: number;

  @Prop({ required: false, default: ''})
  receipt: string;
}

export const CreditSchema = SchemaFactory.createForClass(Credit);
