import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

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
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: false })
  company: string;

  @Prop({ required: true })
  numberOfEmployees: number;

  @Prop({ required: true })
  numberOfBranches: number;

  @Prop({ required: true })
  expectedCredit: number;

  @Prop({ required: false })
  businessType: string;

  @Prop({
    required: true,
    default: { ID: '', TIN: '', License: '', R_Cert: '' },
  })
  documents: Documents;

  @Prop({ required: true, default: false })
  pending: boolean;

  @Prop({ required: true, default: '0.00' })
  creditInfo: string;

  @Prop({ required: false })
  userId: string;

  @Prop({ required: false })
  approvedBy: string;
  // @Prop({ required: false }) // New profile picture field
  // profilePicture: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
