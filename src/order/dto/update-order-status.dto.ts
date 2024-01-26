import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../schemas/orderStatus.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
