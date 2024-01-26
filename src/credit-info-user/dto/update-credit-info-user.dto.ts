import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditInfoUserDto } from './create-credit-info-user.dto';

export class UpdateCreditInfoUserDto extends PartialType(CreateCreditInfoUserDto) {}
