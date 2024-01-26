import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { CreditInfoService } from './credit-info.service';
import { CreateCreditInfoDto } from './dto/create-credit-info.dto';
import { UpdateCreditInfoDto } from './dto/update-credit-info.dto';
import { Response, Request } from 'express';

@Controller('credit-info')
export class CreditInfoController {
  constructor(private readonly creditInfoService: CreditInfoService) {}

  private async handlePromise(promise: Promise<any>, res: Response) {
    try {
      const result = await promise;
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Post()
  async create(
    @Body() createCreditInfoDto: CreateCreditInfoDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const result = await this.creditInfoService.create(
        createCreditInfoDto,
        req.cookies['jwt'],
      );

      if (result === 'Last month debt is not paid') {
        throw new BadRequestException('Last month debt is not paid');
      }

      if (result === 'You already have credit info for this month') {
        throw new BadRequestException(
          'You already have credit info for this month',
        );
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(error.status).json({ error });
    }
  }

  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    return await this.handlePromise(
      this.creditInfoService.findAll(req.cookies['jwt']),
      res,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    return await this.handlePromise(this.creditInfoService.findOne(id), res);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCreditInfoDto: UpdateCreditInfoDto,
    @Res() res: Response,
  ) {
    return await this.handlePromise(
      this.creditInfoService.update(id, updateCreditInfoDto),
      res,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    return await this.handlePromise(this.creditInfoService.remove(id), res);
  }
}
