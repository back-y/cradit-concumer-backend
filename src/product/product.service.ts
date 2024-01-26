import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
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
