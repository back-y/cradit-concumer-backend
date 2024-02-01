import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config';
import { CreditModule } from './credit/credit.module';
import { CreditInfoModule } from './credit-info/credit-info.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CreditInfoUserModule } from './credit-info-user/credit-info-user.module';
import { CreditUserModule } from './credit-user/credit-user.module';

// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import { FileController } from './file/file.controller';
import { NewUserModule } from './new-user/new-user.module';
import { CustomerModule } from './customer/customer.module';
import { IndividualModule } from './individual/individual.module';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    // }),
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoUri'),
      }),
    }),
    AuthModule,
    CreditModule,
    CreditInfoModule,
    // ProductModule,
    OrderModule,
    CreditInfoUserModule,
    CreditUserModule,
    NewUserModule,
    CustomerModule,
    IndividualModule,
  ],
  controllers: [AppController, FileController],
  providers: [AppService],
})
export class AppModule {}
