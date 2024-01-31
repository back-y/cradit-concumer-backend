import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { UpdateCreditStatusDto } from './dto/update-credit-status.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreditDocument } from './schemas/credit.schema';
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Role } from 'src/auth/schemas/role.enum';

@Controller('credit')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  private async handlePromise(promise: Promise<any>, res: Response) {
    try {
      const result = await promise;
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  @Post('upload/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(10)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return await this.handlePromise(
      this.creditService.uploadFile(file, id),
      res,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCreditDto: CreateCreditDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.handlePromise(
      this.creditService.create(createCreditDto),
      res,
    );
  }

  @Get()
  findAll() {
    return this.creditService.findAll();
  }
  @Get('totalCreditGaven')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(Role.credit_manager)
  totalCreditGaven() {
    return this.creditService.totalCreditGaven();
  }

  @Get('totalPaidAmount')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(Role.credit_manager)
  calculateTotalPaidAmount(){
    return this.creditService.calculateTotalPaidAmount();
  }
  
  @Get('TotalCreditInfo')
  TotalCreditInfo(){
    return this.creditService.TotalCreditInfo()
  }

  @Get('getCreditsByUserId/:id')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  //  @Roles(Role.customer)
   getCreditsByUserId(@Param('id') id: string){
    return this.creditService.getCreditsByUserId(id)    
   }
@Get('getSinglUserCreditInfo/:id')
getSingleUserCreditInfo(@Param('id') id: string){
  return this.creditService.getSingleUserCreditInfo(id)
}
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditService.findOne(id);
  }

  @Patch('status/:id')
  updateStatus(@Param('id') id: string, @Body() updateCreditStatusDto: UpdateCreditStatusDto) {
    return this.creditService.updateStatus(id, updateCreditStatusDto);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreditDto: UpdateCreditDto) {
    return this.creditService.update(id, updateCreditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditService.remove(id);
  }
}
