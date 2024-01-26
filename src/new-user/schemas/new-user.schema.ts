import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NewUserDocument = HydratedDocument<NewUser>;

export class Documents {
  @Prop({ required: true, default: '' })
  ID: string;

  @Prop({ required: true, default: '' })
  TIN: string;

  @Prop({ required: true, default: '' })
  License: string;

  @Prop({ required: true, default: '' })
  R_Cert: string;
}

@Schema({ timestamps: true })
export class NewUser {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: false })
  company: string;

  @Prop({ required: true, default: { ID: '', TIN: '', License: '', R_Cert: ''} })
  documents: Documents;

  @Prop({ required: true, default:true})
  pending: boolean;

}

export const NewUserSchema = SchemaFactory.createForClass(NewUser);
