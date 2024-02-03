import { Document } from 'mongoose';

export interface Created extends Document {
  date: Date;
}
