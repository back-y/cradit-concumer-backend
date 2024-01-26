import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export interface orderItem {
  _id: string;

  name: string;

  quantity: number;

  price: number;

}

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  orderItems: Array<orderItem>;

}
