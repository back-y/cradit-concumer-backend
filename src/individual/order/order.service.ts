import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateApiOrderDto } from './dto/create-api-order.dto';
import axios from 'axios'
import { ProductService } from 'src/individual/product/product.service';
import { CreateConfirmedOrderDto } from './dto/create-confirmed-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('IndividualOrder') private orderModel: Model<OrderDocument>,
    private readonly productService: ProductService
  ) {}

  keyPrep(order: any) {
    const crypto = require('crypto');

    const hash = crypto.createHash('sha256');
    const secretKeyPlain = process.env.SECRET_KEY;
    const secretKey = hash.update(secretKeyPlain).digest('hex').slice(0, 32);
    const apiKeyPlain = process.env.API_KEY;
    // console.log("\n\nsecret key: ", secretKeyPlain, "\nsecret key hashed: ", secretKey, "\n\n")
    const csrfToken = crypto.randomBytes(32).toString('hex');
    // const csrfToken = process.env.CSRF_TOKEN;
    
    // Generate a random initialization vector (IV)
    // const iv = crypto.randomBytes(16);
    const iv = 'e04e29b5bb035700'
    // Encrypt the CSRF token using AES-256-CBC
    let cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encryptedCsrf = cipher.update(csrfToken, 'utf-8', 'base64');
    encryptedCsrf += cipher.final('base64');
    
    // Hash the API key using SHA-256
    // const hashedApiKey = crypto.createHash('sha256').update(apiKeyPlain).digest('hex');

    // Combine hashed API key and encrypted CSRF
    const apiKeyWithCsrf = `${process.env.API_KEY}:${encryptedCsrf}`;

    const data = {
      temp_cart: order,
      csrf_token: csrfToken,
      // iv: iv.toString('base64'),
    };

    // console.log('API Key with CSRF:', apiKeyWithCsrf);
    // console.log('Data JSON:', data);
    return { HTTP_API_KEY: apiKeyWithCsrf, body: data}  
  }
  
  async create(createOrderDto: CreateOrderDto) {
    // console.log("Order Service: ", createOrderDto)
    try{
      
      const products = await this.productService.findAll();
    
      const order = createOrderDto.orderItems;
      
      let orderedProducts = [];
      
      order.forEach(item => {
        const foundItem = products.find((product:any) => product._id.toString() === item._id)
        if (foundItem) {
          orderedProducts.push(foundItem);
        } else {
          throw new Error(`Product not found for item with _id: ${item._id}`);
        }
      });

      // console.log("Products: ", products, "\nOrder: ", order, "\nOrdered Products: ", orderedProducts);
      
      // console.log("Prepared Order: ", orderItems, "\ntotal_price: ", total_price)

      let total_price = 0;
      
      const orderItems = orderedProducts.map((item, index) => { 
        total_price += item.price * order[index].quantity;
        return {
          item_image: item.image,
          item_name: item.name,
          item_price: item.price,
          item_quantity: order[index].quantity,
          item_spec: item.description || "no spec",
        }
      })

      const prepOrder: CreateApiOrderDto = {
        orderItems,
        orderInfo: {
          total_price,
          notify_url: process.env.NOTIFY_URL,
          return_url_success: process.env.RETURN_URL_SUCCESS,
          return_url_failure: process.env.RETURN_URL_FAILURE,
          order_id: Array(24).fill(null).map(() => Math.round(Math.random() * 15).toString(16)).join(''),
        },
      }

      const preparedOrder = this.keyPrep(prepOrder);
      const url = process.env.BASE_URL + process.env.END_POINT;
      const headers = {
        'Content-Type': 'application/json',
        'API-Key': preparedOrder.HTTP_API_KEY, // Assuming your API expects the API key in the Authorization header
        // Add any other custom headers as needed
      };
      const resp = await axios.post(url, preparedOrder.body, { headers: headers })

      if (resp.data && resp.data.message === 'Data received successfully!'){
        // console.log("Prepared Order: ", preparedOrder, "\n\nResponse Data: \n\n", resp)
        // console.log('Response: ', resp.data)
        return resp.data;
      }
      return resp.data;
    }
    catch (err) {
      console.log("Request Error: ", err)
    }
  }

  async notify(createConfirmedOrderDto: CreateConfirmedOrderDto) {

    console.log("Nofitication body: ", createConfirmedOrderDto)
    const newOrder = await this.orderModel.create(createConfirmedOrderDto);

    return {status: "success"}
  }


  success() {
    console.log("Order fulfilled!");
    return 'Order fulfilled!'
  }

  failure() {
    return 'Order failed'
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
