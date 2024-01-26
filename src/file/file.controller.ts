import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('file')
export class FileController {
  @Get(':id')
  async getImage(@Param('id') id: string): Promise<StreamableFile> {
    const filePath = join(__dirname, '..', '..', '..','uploads', id);
    const response = new StreamableFile(createReadStream(filePath));
    
    return response;
  }
}