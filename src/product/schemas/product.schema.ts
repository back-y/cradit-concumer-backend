import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { ProductStatus } from './product-status.enum';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true, unique: true })
  itemCode: string;

  @Prop({ enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  userId: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
