import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('upload/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
        { name: 'file1', maxCount: 1 },
        { name: 'file2', maxCount: 1 },
        { name: 'file3', maxCount: 1 },
        { name: 'file4', maxCount: 1 },
        // Add more file configurations as needed
    ], {
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
  async uploadFiles(
    @UploadedFiles() files: { 
        file1: Express.Multer.File, 
        file2: Express.Multer.File, 
        file3: Express.Multer.File, 
        file4: Express.Multer.File
    },
    @Param('id') id: string,
  ) {
    // Handle each file as needed
    const file1 = files.file1;
    const file2 = files.file2;
    const file3 = files.file3;
    const file4 = files.file4;
    // Call the service method with the files and id
    return await this.customerService.uploadFiles([file1, file2, file3, file4], id);
  }

  // @Post()
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //       { name: 'profilePicture', maxCount: 1 },
  //       ], {
  //       storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //           const randomName = Array(10)
  //           .fill(null)
  //           .map(() => Math.round(Math.random() * 16).toString(16))
  //           .join('');
  //           return cb(null, `${randomName}${extname(file.originalname)}`);
  //       },
  //       }),
  //   }),
  // )
  // create(
  //   @UploadedFiles() files: { 
  //     profilePicture: Express.Multer.File, 
  //   },@Body() createCustomerDto: CreateCustomerDto) {
  //     const profilePicture = files.profilePicture;
  //   return this.customerService.create(createCustomerDto,[profilePicture]);
  // }
  @Post()

  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }
  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
