import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreditUserService } from './credit-user.service';
import { CreateCreditUserDto } from './dto/create-credit-user.dto';
import { UpdateCreditUserDto } from './dto/update-credit-user.dto';

@Controller('credit-user')
export class CreditUserController {
  constructor(private readonly creditUserService: CreditUserService) {}

  @Post()
  create(@Body() createCreditUserDto: CreateCreditUserDto) {
    return this.creditUserService.create(createCreditUserDto);
  }

  @Get()
  findAll() {
    return this.creditUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreditUserDto: UpdateCreditUserDto) {
    return this.creditUserService.update(+id, updateCreditUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditUserService.remove(+id);
  }
}
