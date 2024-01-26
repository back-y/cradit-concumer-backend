import { Module } from '@nestjs/common';
import { CreditUserService } from './credit-user.service';
import { CreditUserController } from './credit-user.controller';

@Module({
  controllers: [CreditUserController],
  providers: [CreditUserService],
})
export class CreditUserModule {}
