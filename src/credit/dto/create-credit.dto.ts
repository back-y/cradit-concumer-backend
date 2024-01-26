import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEmail,
} from 'class-validator';
import { orderItems } from 'src/order/dto/create-order.dto';

import { Comments } from '../interfaces/comments.interface';


export class CreateCreditDto {
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @IsNotEmpty()
  @IsArray()
  products: Array<orderItems>;

  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  userName: string;

  @IsOptional()
  @IsEmail()
  userEmail: string;

  @IsNotEmpty()
  @IsString()
  creditInfoId: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  editOrderId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  paidAmount: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  receipt: string;

  @IsOptional()
  @IsNotEmpty()
  comments: Comments[];
}
