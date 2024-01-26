import { IsNotEmpty, IsString, IsEmail, IsOptional, IsJSON, IsBoolean } from 'class-validator';
import { Documents } from '../interfaces/documents.interface';

export class CreateNewUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  company: string;

  @IsOptional()
  @IsNotEmpty()
  documents: Documents;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  pending: boolean; 


}
