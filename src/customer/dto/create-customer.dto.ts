import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEmail,
  IsOptional,
  IsJSON,
  IsBoolean,
} from 'class-validator';
import { Documents } from '../interfaces/documents.interface';

export class CreateCustomerDto {
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

  @IsOptional()
  @IsNotEmpty()
  creditInfo: string;

  @IsOptional()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsNotEmpty()
  approvedBy: string;

  @IsNotEmpty()
  @IsNumber()
  numberOfEmployees: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfBranches: number;

  @IsNotEmpty()
  @IsNumber()
  expectedCredit: number;

  @IsNotEmpty()
  @IsString()
  businessType: string;

  @IsOptional()
  @IsNotEmpty()
  profilePicture: string;
}
