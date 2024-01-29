import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  Headers,
  UseGuards,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/schemas/role.enum';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  private async handlePromise(
    promise: Promise<any>,
    res: Response,
  ): Promise<any> {
    try {
      const result = await promise;
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.customer)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const result = await this.orderService.create(
        createOrderDto,
        req.cookies['jwt'],
      );

      if (result === "User doesn't have credit info") {
        throw new NotFoundException("User doesn't have credit info");
      }

      if (result === 'There is no credit for this month') {
        throw new NotFoundException('There is no credit for this month');
      }

      if (result === 'Not enough credit') {
        throw new BadRequestException('Not enough credit');
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status).json({ error });
    }
  }

  @Patch('status/:id')
  async updateStatus(
    @Body() orderStatus: UpdateOrderStatusDto,
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const result = await this.orderService.updateStatus(
        orderStatus,
        id,
        req.cookies['jwt'],
      );

      if (result === 'Order not found') {
        throw new NotFoundException('Order not found');
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status).json({ error });
    }
  }

  @Get('totalOrderPrice')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(Role.credit_manager)
  async countOrders(){
    const totalOrders =await this.orderService.totalOrderPrice();
    return  totalOrders ;
  };
  /* @Get('allOrder')
  async getallorders(){
    return this.orderService.findallorder()
  } */
  @Get('deliveryCustomer/:id')
  async deliveryCustomer(
    @Query() query: { orderDelivery: boolean },
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return await this.handlePromise(
      this.orderService.updateDeliveryCustomer(
        query.orderDelivery,
        id,
        req.cookies['jwt'],
      ),
      res,
    );
  }

  @Get('deliveryWarehouse/:id')
  async deliveryWarehouse(
    @Query() query: { orderDelivery: boolean },
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    console.log(query.orderDelivery);
    return await this.handlePromise(
      this.orderService.updateDeliveryWarehouse(query.orderDelivery, id),
      res,
    );
  }

  @Get()
  async findAll(@Res() res: Response, @Req() req: Request, @Headers() headers: Record<string, string>) {
    console.log(" Corporate Order Controller --- @Get() to findAll(): \nbody:", req.body, "\nheaders: " , headers)
    console.log("request cookies: ", req.cookies)
    const jwt = headers.authorization
    return await this.handlePromise(
      this.orderService.findAll(headers.authorization.split(' ')[1]),
      res,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, res: Response) {
    // return await this.handlePromise(this.orderService.findOne(id), res);
    return this.orderService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return await this.handlePromise(
      this.orderService.update(id, updateOrderDto, req.cookies['jwt']),
      res,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return await this.handlePromise(
      this.orderService.remove(id, req.cookies['jwt']),
      res,
    );
  }
}
