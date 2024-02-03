import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { NewUserService } from './new-user.service';
import { CreateNewUserDto } from './dto/new-user.dto';
import { diskStorage } from 'multer';
import {
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { extname } from 'path';

@Controller('new-user')
export class NewUserController {
  constructor(private readonly newUserService: NewUserService) {}

  @Post('upload/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file1', maxCount: 1 },
        { name: 'file2', maxCount: 1 },
        { name: 'file3', maxCount: 1 },
        { name: 'file4', maxCount: 1 },
        // Add more file configurations as needed
      ],
      {
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
      },
    ),
  )
  async uploadFiles(
    @UploadedFiles()
    files: {
      file1: Express.Multer.File;
      file2: Express.Multer.File;
      file3: Express.Multer.File;
      file4: Express.Multer.File;
    },
    @Param('id') id: string,
  ) {
    // Handle each file as needed
    const file1 = files.file1;
    const file2 = files.file2;
    const file3 = files.file3;
    const file4 = files.file4;
    // Call the service method with the files and id
    return await this.newUserService.uploadFiles(
      [file1, file2, file3, file4],
      id,
    );
  }

  //     @Post()
  //   @UseInterceptors(
  //     FileFieldsInterceptor([
  //         { name: 'profilePicture', maxCount: 1 },
  //         ], {
  //         storage: diskStorage({
  //         destination: './uploads',
  //         filename: (req, file, cb) => {
  //             const randomName = Array(10)
  //             .fill(null)
  //             .map(() => Math.round(Math.random() * 16).toString(16))
  //             .join('');
  //             return cb(null, `${randomName}${extname(file.originalname)}`);
  //         },
  //         }),
  //     }),
  //   )
  //   create(
  //     @UploadedFiles() files: {
  //       profilePicture: Express.Multer.File,
  //     },@Body() createNewUserDto: CreateNewUserDto) {
  //       const profilePicture = files.profilePicture;
  //         return this.newUserService.create(createNewUserDto,[profilePicture])
  //     }
  @Post()
  create(@Body() createNewUserDto: CreateNewUserDto) {
    console.log(createNewUserDto)
    return this.newUserService.create(createNewUserDto);
  }
  @Get()
  findAll() {
    return this.newUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newUserService.findOne(id);
  }

  @Patch(':id')
  update(@Body() updateNewUserDto: CreateNewUserDto, @Param('id') id: string) {
    return this.newUserService.update(id, updateNewUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.newUserService.delete(id);
  }
}
