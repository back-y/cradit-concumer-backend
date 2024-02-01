import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { OrderStatus } from './orderStatus.enum';

export type OrderDocument = HydratedDocument<Order>;

class items {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  quantity: number;

  @Prop()
  price: number;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  editOrderId: string;

  @Prop()
  creditInfoId: string;

  @Prop({ required: true })
  orderItems: [items];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: false })
  isDeliveredWarehouse: boolean;

  @Prop({ default: false })
  isDeliveredCustomer: boolean;

  @Prop({ default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  acceptedBy: User;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  rejectedBy: User;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  deliveredBy: User;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  paidBy: User;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  processedBy: User;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  editedBy: User;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
