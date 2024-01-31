import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from './schemas/product.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class ProductService {
  private count = 1;
  private page = 1;
  private productsOnPage = true;
  constructor(
    @InjectModel('Products_For_Individual')
    private productModel: Model<ProductDocument>,
  ) {}

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
  @Cron(CronExpression.EVERY_30_MINUTES)
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
              if (
                newProduct.stock_status === 'instock' &&
                newProduct.quantity > 0
              )
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

  async create(createProductDto: CreateProductDto) {
    const newProduct = new this.productModel(createProductDto);

    return await newProduct.save();
  }

  async findAll(page: number = 1, limit: number = Infinity) {
    const skip = (page - 1) * limit;
    return await this.productModel
      .find({ stock_status: 'instock', quantity: { $gt: 0 } })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getDocumentCount() {
    return this.productModel.countDocuments().exec();
  }

  async findOne(id: string) {
    return await this.productModel.findById(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.productModel.findByIdAndUpdate(id, updateProductDto);
  }

  async remove(id: string) {
    return await this.productModel.findByIdAndDelete(id);
  }
}
