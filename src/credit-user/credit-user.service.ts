import { Injectable } from '@nestjs/common';
import { CreateCreditUserDto } from './dto/create-credit-user.dto';
import { UpdateCreditUserDto } from './dto/update-credit-user.dto';

@Injectable()
export class CreditUserService {
  create(createCreditUserDto: CreateCreditUserDto) {
    return 'This action adds a new creditUser';
  }

  findAll() {
    return `This action returns all creditUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} creditUser`;
  }

  update(id: number, updateCreditUserDto: UpdateCreditUserDto) {
    return `This action updates a #${id} creditUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} creditUser`;
  }
}
