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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  private async handlePromise(
    promise: Promise<any>,
    res: Response,
  ): Promise<any> {
    try {
      const result = await promise;
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error, success: false });
    }
  }

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // console.log('The request ', req.cookies);
    return await this.handlePromise(
      this.productService.create(createProductDto, req.cookies['jwt']),
      res,
    );
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
      this.productService.uploadFile(file, id),
      res,
    );
  }

  @Get()
  async findAll(@Res() res: Response) {
    return await this.handlePromise(this.productService.findAll(), res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    return await this.handlePromise(this.productService.findOne(id), res);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ) {
    return await this.handlePromise(
      this.productService.update(id, updateProductDto),
      res,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    return await this.handlePromise(this.productService.remove(id), res);
  }
}
