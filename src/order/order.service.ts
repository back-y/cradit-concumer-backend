import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/auth/user.service';
import { CreditService } from 'src/credit/credit.service';
import { CreditInfoService } from 'src/credit-info/credit-info.service';
import * as dayjs from 'dayjs';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private jwtService: JwtService,
    private userService: UserService,
    private creditService: CreditService,
    private creditInfoService: CreditInfoService,
    private productService: ProductService,
  ) {}

  private async handlePromise(promise: Promise<any>): Promise<any> {
    try {
      const result = await promise;
      return result;
    } catch (error) {
      return error;
    }
  }
async findallorder(){
  return this.orderModel.find()
}
  async create(createOrderDto: CreateOrderDto, jwt: any) {
    try {
      const { userId } = this.jwtService.decode(jwt) as { userId: any };
      const userName = (await this.userService.findById(userId)).name;
      const userEmail = (await this.userService.findById(userId)).email;
      // const editOrderId = Array(10).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
      // TODO: check if previous month debt is paid and current < duedate

      const creditInfo = await this.creditInfoService.findOneByUserId(userId);

      if (creditInfo === null) {
        return "User doesn't have credit info";
      }

      const creditMonth = dayjs(creditInfo.createdAt).month();
      const currentMonth = dayjs().month();

      if (creditMonth !== currentMonth) {
        return 'There is no credit for this month';
      }

      const remainingCredit = creditInfo.remainingCredit;

      let totalPrice = 0;

      // Use for...of loop to handle async/await properly
      for (const item of createOrderDto.orderItems) {
        const product = await this.productService.findOne(item._id);
        console.log('order', product);
        totalPrice += product.price * item.quantity;
      }

      console.log('totalPrice', totalPrice);
      console.log('remainingCredit', remainingCredit);

      if (remainingCredit < totalPrice) {
        return 'Not enough credit';
      }

      const newOrder = await this.orderModel.create({
        ...createOrderDto,
        userId,
        userName,
        userEmail,
        totalPrice,
        creditInfoId: creditInfo._id,
      });

      // TODO: Notifiy credit manager

      console.log(newOrder);

      return newOrder;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateStatus(orderStatus: UpdateOrderStatusDto, id: string, jwt: any) {
    try {
      const { userId } = this.jwtService.decode(jwt) as { userId: any };

      const checkOrder = await this.orderModel.findById(id);

      if (!checkOrder) return 'Order not found';

      if (orderStatus.status === 'ACCEPTED') {
        // add order to credit

        const newCredit = await this.creditService.create({
          totalPrice: checkOrder.totalPrice,
          products: checkOrder.orderItems,
          userId: checkOrder.userId,
          userName: checkOrder.userName,
          userEmail: checkOrder.userEmail,
          creditInfoId: checkOrder.creditInfoId,
          orderId: checkOrder._id as unknown as string,
          editOrderId: checkOrder.editOrderId,
          paidAmount: 0,
          receipt: '',
          comments: [],
        });

        // update credit info

        const updatedCreditInfo = await this.creditInfoService.updateCredits(
          checkOrder.creditInfoId,
          checkOrder.totalPrice,
        );
      }

      const updatedOrder = await this.orderModel.findByIdAndUpdate(
        id,
        { status: orderStatus.status },
        { new: true },
      );

      return updatedOrder;
    } catch (error) {}
  }

  async findAll(jwt: any): Promise<Array<OrderDocument>> {
    try {
      const { userId } = this.jwtService.decode(jwt) as { userId: any };

      const role = (await this.userService.findById(userId)).role;

      const query = role === 'customer' ? { userId } : {};

      const orders = this.orderModel.find(query);

      return orders;
    } catch (error) {
      return error;
    }
  }

  async findOne(id: string): Promise<OrderDocument> {
    return await this.handlePromise(this.orderModel.findById(id));
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, jwt: any) {
    try {
      const { userId } = this.jwtService.decode(jwt) as { userId: any };

      const checkOwner = await this.orderModel.findOne({ _id: id, userId });

      if (!checkOwner) throw new Error('Order not found');

      const updatedOrder = await this.orderModel.findByIdAndUpdate(
        id,
        updateOrderDto,
        { new: true },
      );

      return updatedOrder;
    } catch (error) {
      return error;
    }
  }

  async updateDeliveryCustomer(orderDelivery: boolean, id: string, jwt: any) {
    try {
      const { userId } = this.jwtService.decode(jwt) as { userId: any };

      const checkOwner = await this.orderModel.findOne({ _id: id, userId });

      if (!checkOwner) return 'Order not found';

      const updateDeliveryStatus = await this.orderModel.findByIdAndUpdate(
        id,
        { isDeliveredCustomer: orderDelivery },
        { new: true },
      );

      return updateDeliveryStatus;
    } catch (error) {
      return error;
    }
  }

  async updateDeliveryWarehouse(orderDelivery: boolean, id: string) {
    try {
      const existingOrder = await this.orderModel.findById(id);

      if (!existingOrder) return 'Order not found';

      const updateOrder = await this.orderModel.findByIdAndUpdate(
        id,
        { isDeliveredWarehouse: orderDelivery },
        { new: true },
      );

      return updateOrder;
    } catch (error) {
      return error;
    }
  }

  async totalOrderPrice(): Promise<number> {
    
    try {
      const orders: OrderDocument[] = await this.orderModel.find().exec();

      // Calculate the sum of all order prices
      let totalOrderPrice = 0;
      orders.forEach(order => {
        order.orderItems.forEach(item => {
          totalOrderPrice += item.price * item.quantity;
        });
      });

      return totalOrderPrice;
    } catch (error) {
      // Handle errors appropriately (e.g., log, throw, etc.)
      throw error;
    }
  }


  async remove(id: string, jwt: any) {
    try {
      const { userId } = this.jwtService.decode(jwt) as { userId: any };

      const checkOwner = await this.orderModel.findOne({ _id: id, userId });

      if (!checkOwner) throw new Error('Order not found');

      const deletedOrder = await this.orderModel.findByIdAndDelete(id);

      return {
        message: 'Order deleted successfully',
        deletedOrder,
      };
    } catch (error) {
      return error;
    }
  }
}
