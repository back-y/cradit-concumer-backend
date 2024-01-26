import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

class User_Info {
    @Prop()
    user_id: string;

    @Prop()
    date_of_birth: string;

    @Prop()
    full_name: string;
    
    @Prop()
    phone_number: string;
    
    @Prop()
    email: string;
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true })
    api_key: string;
    
    order_id: string;

    @Prop({ required: true })
    result: string;

    @Prop({ required: true })
    user_info: User_Info;

    @Prop({ required: true })
    description: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
