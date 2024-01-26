import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProductImageDocument = HydratedDocument<ProductImage>;

@Schema({ timestamps: true })
export class ProductImage {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ required: true })
  productId: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);
