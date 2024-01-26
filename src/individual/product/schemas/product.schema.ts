import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
// import { ProductStatus } from './product-status.enum';

export class Category {
    @Prop({required: true})
    id: number;

    @Prop({required: true})
    name: string;
}

export type ProductDocument = HydratedDocument<Product>;

@Schema({timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    quantity: number;

    @Prop()
    image: Array<string>;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true, default: 'Kg'})
    unit: string;

    @Prop({ required: true })
    itemCode: string;

    // @Prop({ enum: ProductStatus, default: ProductStatus.ACTIVE })
    // status: ProductStatus;

    @Prop({ required: false, default: '' })
    description: string;

    @Prop()
    categories: Category[];

    @Prop({ required: true})
    stock_status: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
