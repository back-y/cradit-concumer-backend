import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewUserController } from './new-user.controller';
import { NewUserService } from './new-user.service';
import { NewUserSchema } from './schemas/new-user.schema';

@Module({
    imports: [MongooseModule.forFeature([{name: 'NewUser', schema: NewUserSchema}])],
    controllers: [NewUserController],
    providers: [NewUserService],
})
export class NewUserModule {}
