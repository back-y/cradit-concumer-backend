import { Controller, Get, Post, Body, Headers, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateConfirmedOrderDto } from './dto/create-confirmed-order.dto';

@Controller('individual/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('notify')
  notify(
    @Headers() headers: Record<string, string>,
    @Body() createConfirmedOrderDto: CreateConfirmedOrderDto
  ) {
    // console.log("notify_headers: ", headers)
    // console.log("notify_body: ", createConfirmedOrderDto)
    return this.orderService.notify(createConfirmedOrderDto);
  }

  @Get('success')
  success(
    @Headers() headers: Record<string, string>,
    // @Body() createSuccessfulOrderDto: any
  ) {
    // console.log("success_headers: ", headers)
    // console.log("success_body: ", createSuccessfulOrderDto)
    return this.orderService.success();
  }

  @Get('failure')
  failure(
    @Headers() headers: Record<string, string>,
    // @Body() createSuccessfulOrderDto: any
  ) {
    // console.log("failure_headers: ", headers)
    // console.log("failure_body: ", createSuccessfulOrderDto)
    return this.orderService.failure();
  }


  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    // console.log("Order Controller: ", createOrderDto)
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    // console.log("Order Controller get all ...")
    return "testing";
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
