import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCreditInfoDto {
  @IsNumber()
  @IsNotEmpty()
  creditAmt: number;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
