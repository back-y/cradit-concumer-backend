import { IsEnum, IsNotEmpty } from 'class-validator';
import { CreditStatus } from '../schemas/creditStatus.enum';

export class UpdateCreditStatusDto {
  @IsEnum(CreditStatus)
  @IsNotEmpty()
  status: CreditStatus;
}
