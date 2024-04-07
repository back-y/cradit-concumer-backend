import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export interface orderItems {
  _id: string;

  name: string;

  quantity: number;

  price: number;
  // new 
}

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  orderItems: Array<orderItems>;

  @IsNotEmpty()
  @IsString()
  editOrderId: string;
}
