import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditDto } from './create-credit.dto';
import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateCreditDto extends PartialType(CreateCreditDto) {
    @IsOptional()
    @IsNotEmpty()
    receipt:string;
}
