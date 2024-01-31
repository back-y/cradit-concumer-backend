import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  private count = 1;
  private page = 1;
  private productsOnPage = true;
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private jwtService: JwtService,
  ) {}

  private async handlePromise(promise: Promise<any>): Promise<any> {
    try {
      const result = await promise;
      return result;
    } catch (error) {
      return error;
    }
  }

  getKgProduct = (item: any) => ({
    itemCode: item.id.toString(),
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.stock_quantity),
    image: item.images.map((img: any) => img.src) || '',
    unit: 'Kg',
    // description: item.description,
    categories: item.categories,
    stock_status: item.stock_status,
  });

  // @Cron(CronExpression.EVERY_DAY_AT_1PM)
  @Cron(CronExpression.EVERY_30_SECONDS)
  async updateProducts(createProductDto: CreateProductDto) {
    console.log(
      `Triggered for ${this.count++} time, current page = ${
        this.page
      }, and productsOnPage = ${this.productsOnPage}`,
    );

    this.productsOnPage = true;
    this.page = 1;

    console.log(`productsOnPage = ${this.productsOnPage}`);

    try {
      while (this.productsOnPage) {
        const kgUrl = `${process.env.KG_URL}?per_page=100&page=${this.page}&${process.env.KG_KEYS}`;
        const resp = await axios.get(kgUrl);
        if (resp.data.length === 0) {
          this.productsOnPage = false;
        }
        const products = await this.productModel.find();

        await Promise.all(
          resp.data.map(async (item: any) => {
            const kgProduct = this.getKgProduct(item);

            const existingProduct = await this.productModel.findOne({
              itemCode: item.id.toString(),
            });
            if (!existingProduct) {
              const newProduct = new this.productModel(kgProduct);
              if (newProduct.status === 'ACTIVE' && newProduct.quantity > 0)
                await newProduct.save();
            } else {
              await this.productModel.findOneAndUpdate(
                existingProduct._id,
                kgProduct,
              );
            }
          }),
        );
        this.page = this.page + 1;
        console.log(
          'Page #: ',
          this.page,
          '   |   # of products: ',
          resp.data.length,
        );
      }
    } catch (error) {
      // Handle duplicate key error
      if (error.name === 'MongoError' && error.code === 11000) {
        console.log('Duplicate key error. Handle accordingly.');
      } else {
        // Handle other errors
        console.error('An error occurred:', error);
      }
    }
  }

  async create(createProductDto: CreateProductDto, jwt: any) {
    try {
      const { userId } = this.jwtService.decode(jwt) as { userId: any };

      const newProduct = new this.productModel({
        ...createProductDto,
        userId,
      });

      return await newProduct.save();
    } catch (error) {
      if (error.code === 11000 && error.keyPattern.itemCode) {
        return {
          error: 'Item code already exists',
          success: false,
        };
      }
      return { error, success: false };
    }
  }

  async uploadFile(file: Express.Multer.File, id: string) {
    try {
      const product = await this.productModel.findById(id);

      product.image = file.filename;

      return await product.save();
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    return await this.handlePromise(this.productModel.find());
  }

  async findOne(id: string) {
    return await this.handlePromise(this.productModel.findById(id));
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.handlePromise(
      this.productModel.findByIdAndUpdate(id, updateProductDto),
    );
  }

  async remove(id: string) {
    return await this.handlePromise(this.productModel.findByIdAndDelete(id));
  }
}
