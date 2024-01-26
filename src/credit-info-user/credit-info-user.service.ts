import { Injectable } from '@nestjs/common';
import { CreateCreditInfoUserDto } from './dto/create-credit-info-user.dto';
import { UpdateCreditInfoUserDto } from './dto/update-credit-info-user.dto';

@Injectable()
export class CreditInfoUserService {
  create(createCreditInfoUserDto: CreateCreditInfoUserDto) {
    return 'This action adds a new creditInfoUser';
  }

  findAll() {
    return `This action returns all creditInfoUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} creditInfoUser`;
  }

  update(id: number, updateCreditInfoUserDto: UpdateCreditInfoUserDto) {
    return `This action updates a #${id} creditInfoUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} creditInfoUser`;
  }
}
