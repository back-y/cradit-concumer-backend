import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from 'src/individual/product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'IndividualOrder', schema: OrderSchema }]),
    ProductModule
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
  ],
})
export class OrderModule {}
