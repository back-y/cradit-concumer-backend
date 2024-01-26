import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export interface orderItem {
  item_image: string;
  item_name: string;
  item_spec: string;
  item_price: number;
  item_quantity: number;
}

export interface orderInfo {
    total_price: number;
    notify_url: string;
    return_url_success: string;
    return_url_failure: string;
    order_id: string;
}

export class CreateApiOrderDto {
  @IsArray()
  @IsNotEmpty()
  orderItems: Array<orderItem>;
  orderInfo: orderInfo;
}
