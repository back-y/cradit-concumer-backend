import { Module } from "@nestjs/common";
import { OrderModule } from 'src/individual/order/order.module'
import { ProductModule } from "src/individual/product/product.module";
import { CustomerModule } from './customer/customer.module';
@Module({
    imports: [
        OrderModule,
        ProductModule,
        CustomerModule,
    ]
})
export class IndividualModule {}