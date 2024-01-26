import { Injectable } from '@nestjs/common';
import { CreateCreditInfoDto } from './dto/create-credit-info.dto';
import { UpdateCreditInfoDto } from './dto/update-credit-info.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreditInfo } from './schemas/credit-info.schema';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { UserService } from 'src/auth/user.service';

@Injectable()
export class CreditInfoService {
  constructor(
    @InjectModel('CreditInfo')
    private readonly creditInfoModel: Model<ICreditInfo>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private async handlePromise(promise: Promise<any>): Promise<any> {
    try {
      const result = await promise;
      return result;
    } catch (error) {
      return error;
    }
  }

  async create(createCreditInfoDto: CreateCreditInfoDto, jwt: any) {
    try {
      const { userId } = this.jwtService.decode(jwt) as { userId: any };

      const lastRecord = await this.creditInfoModel
        .findOne({ userId: createCreditInfoDto.userId })
        .sort({ createdAt: -1 });

      const now = dayjs();

      if (lastRecord) {
        if (lastRecord.isPaid === false) {
          return 'Last month debt is not paid';
        }

        const lastRecordDueDate = dayjs(lastRecord.dueDate);
        if (now < lastRecordDueDate) {
          return 'You already have credit info for this month';
        }
      }

      const newCreditInfo = new this.creditInfoModel({
        ...createCreditInfoDto,
        createdBy: userId,
        remainingCredit: createCreditInfoDto.creditAmt,
        dueDate: dayjs().endOf('month').add(5, 'day').toDate(),
      });

      return await newCreditInfo.save();
    } catch (error) {
      return error;
    }
  }

  async findAll(jwt: any) {
    const { userId } = this.jwtService.decode(jwt) as { userId: any };
    const role = (await this.userService.findById(userId)).role;

    const query = role === 'customer' ? { userId } : {};

    return await this.handlePromise(this.creditInfoModel.find(query));
  }

  async findOne(id: string) {
    return await this.handlePromise(this.creditInfoModel.findById(id));
  }

  async findOneByUserId(userId: string) {
    return await this.handlePromise(
      this.creditInfoModel.findOne({ userId }).sort({ createdAt: -1 }),
    );
  }

  async update(id: string, updateCreditInfoDto: UpdateCreditInfoDto) {
    return await this.handlePromise(
      this.creditInfoModel.findByIdAndUpdate(id, updateCreditInfoDto, {
        new: true,
      }),
    );
  }

  async updateCredits(id: string, totalPrice: number) {
    return await this.handlePromise(
      this.creditInfoModel.findByIdAndUpdate(
        id,
        {
          $inc: { remainingCredit: -totalPrice, usedCredit: totalPrice },
        },
        { new: true },
      ),
    );
  }

  async remove(id: string) {
    return await this.handlePromise(this.creditInfoModel.findByIdAndRemove(id));
  }
}
