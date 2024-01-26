import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditUserDto } from './create-credit-user.dto';

export class UpdateCreditUserDto extends PartialType(CreateCreditUserDto) {}
