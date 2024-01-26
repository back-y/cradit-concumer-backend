import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditInfoDto } from './create-credit-info.dto';

export class UpdateCreditInfoDto extends PartialType(CreateCreditInfoDto) {}
