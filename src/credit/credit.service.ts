import { Injectable } from '@nestjs/common';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { UpdateCreditStatusDto } from './dto/update-credit-status.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Credit, CreditDocument } from './schemas/credit.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class CreditService {
  constructor(
    @InjectModel(Credit.name)
    private readonly creditModel: Model<CreditDocument>,
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

  async uploadFile(file: Express.Multer.File, id: string) {
    try {
      const product = await this.creditModel.findById(id);

      product.receipt = file.filename;

      return await product.save();
    } catch (error) {
      return error;
    }
  }

async totalCreditGaven():  Promise<number> {
  let totalPrice = 0;

  try {
      const credits = await this.creditModel.find({});

      for (const credit of credits) {
          totalPrice += credit.totalPrice;
      }

      return totalPrice;
  } catch (error) {
      console.error('Error calculating total price:', error);
      throw error;
  }
}

async calculateTotalPaidAmount(){
  let totalPaidAmount = 0;

  try {
      const credits = await this.creditModel.find({});

      for (const credit of credits) {
        totalPaidAmount += credit.paidAmount || 0; 
    }

      return totalPaidAmount;
  } catch (error) {
      console.error('Error calculating total price:', error);
      throw error;
  }
}

async getCreditsByUserId(id: string): Promise<number> {
  try {
   
      const credits = await this.creditModel.find({ userId: id });
      let totalPrice = 0;
      for (const credit of credits) {
          totalPrice += credit.totalPrice;
      }

      return totalPrice;
  } catch (error) {
      // Handle errors appropriately
      console.error('Error getting credits by user ID:', error);
      throw error;
  }
}
  async create(createCreditDto: CreateCreditDto) {
    try {
      const newCredit = new this.creditModel({
        ...createCreditDto,
      });

      return await newCredit.save();
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    return await this.creditModel.find();
  }

  async findOne(id: string) {
    return await this.handlePromise(this.creditModel.findById(id));
  }

  async update(id: string, updateCreditDto: UpdateCreditDto) {
    return await this.creditModel.findByIdAndUpdate(id, updateCreditDto);
  }

  async updateStatus(id: string, updateCreditStatusDto: UpdateCreditStatusDto) {
    return await this.creditModel.findByIdAndUpdate(id, updateCreditStatusDto);
  }

  async remove(id: string) {
    return await this.creditModel.findByIdAndDelete(id);
  }
}
