import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreditInfoUserService } from './credit-info-user.service';
import { CreateCreditInfoUserDto } from './dto/create-credit-info-user.dto';
import { UpdateCreditInfoUserDto } from './dto/update-credit-info-user.dto';

@Controller('credit-info-user')
export class CreditInfoUserController {
  constructor(private readonly creditInfoUserService: CreditInfoUserService) {}

  @Post()
  create(@Body() createCreditInfoUserDto: CreateCreditInfoUserDto) {
    return this.creditInfoUserService.create(createCreditInfoUserDto);
  }

  @Get()
  findAll() {
    return this.creditInfoUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditInfoUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreditInfoUserDto: UpdateCreditInfoUserDto) {
    return this.creditInfoUserService.update(+id, updateCreditInfoUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditInfoUserService.remove(+id);
  }
}
