import { Module } from '@nestjs/common';
import { CreditInfoUserService } from './credit-info-user.service';
import { CreditInfoUserController } from './credit-info-user.controller';

@Module({
  controllers: [CreditInfoUserController],
  providers: [CreditInfoUserService],
})
export class CreditInfoUserModule {}
