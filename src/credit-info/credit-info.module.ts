import { Module } from '@nestjs/common';
import { CreditInfoService } from './credit-info.service';
import { CreditInfoController } from './credit-info.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditInfoSchema } from './schemas/credit-info.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CreditInfo', schema: CreditInfoSchema },
    ]),
    AuthModule,
    JwtModule,
  ],
  controllers: [CreditInfoController],
  providers: [CreditInfoService],
  exports: [CreditInfoService],
})
export class CreditInfoModule {}
