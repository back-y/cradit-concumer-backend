import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CustomerDocument } from './schemas/customer.schema';
import * as fs from 'fs';
import { join } from 'path';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomerCreatedEvent } from './events/customer-created.event';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer')
    private readonly customerModel: Model<CustomerDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async uploadFiles(files: Array<Express.Multer.File>, id: string) {
    try {
      const customer = await this.customerModel.findById(id);

      customer.documents.ID = files[0][0].filename;
      customer.documents.TIN = files[1][0].filename;
      customer.documents.License = files[2][0].filename;
      customer.documents.R_Cert = files[3][0].filename;

      return await this.customerModel.findByIdAndUpdate(id, customer, {
        new: true,
      });
    } catch (error) {
      return error;
    }
  }

  async deleteFiles(id: string) {
    const customer = await this.findOne(id);
    if (customer) {
      const imgId = customer.documents.ID;
      const imgLicense = customer.documents.License;
      const imgTin = customer.documents.TIN;
      const imgReg = customer.documents.R_Cert;

      const filePaths = [];
      const imgNames = [imgId, imgLicense, imgTin, imgReg];
      imgNames.forEach((imgName) =>
        filePaths.push(join(__dirname, '..', '..', '..', 'uploads', imgName)),
      );
      filePaths.forEach(async (filePath, index) => {
        try {
          // Check if the file exists
          await fs.promises.access(filePath, fs.constants.F_OK);

          // Delete the file
          await fs.promises.unlink(filePath);

          console.log(`File ${imgNames[index]} deleted successfully.`);
        } catch (error) {
          // File not found or error deleting
          console.error(
            `Error deleting file ${imgNames[index]}, probably not found:`,
            error,
          );
          // throw new NotFoundException(`File ${imgNames[index]} not found.`)
        }
      });
    }
  }

  async uploadProfile(files: Array<Express.Multer.File>, id: string) {
    try {
        const newUser = await this.customerModel.findById(id);

        newUser.profilePicture = files[0][0].filename;

        console.log('new-user: ', newUser)
        
        return newUser.save()
    
    } catch (error) {
        return error;
    }
}
  async create(createCustomerDto: CreateCustomerDto) {
    const customer = new this.customerModel(createCustomerDto);
    const cus = await customer.save();
    const customerCreatedEvent = new CustomerCreatedEvent();
    customerCreatedEvent.name = 'tttt';
    customerCreatedEvent.description = 'rtrtrt';
    this.eventEmitter.emit('customer.created', customerCreatedEvent);
    return cus;
  }

  async findAll() {
    return await this.customerModel.find();
  }

  async findOne(id: string) {
    return await this.customerModel.findById(id);
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    return await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, {
      new: true,
    });
  }
  /* async update(id: string, updateCustomerDto: UpdateCustomerDto, profilePicture: Express.Multer.File[]) {
    const updatedCustomer = await this.customerModel.findById(id);
  
    if (!updatedCustomer) {
      throw new NotFoundException('Customer not found');
    }
  
    updatedCustomer.name = updateCustomerDto.name;
    updatedCustomer.email = updateCustomerDto.email;
    updatedCustomer.phone = updateCustomerDto.phone;
    updatedCustomer.company = updateCustomerDto.company;
    updatedCustomer.pending = updateCustomerDto.pending;
    updatedCustomer.creditInfo = updateCustomerDto.creditInfo;
    updatedCustomer.userId = updateCustomerDto.userId;
    updatedCustomer.approvedBy = updateCustomerDto.approvedBy;
  
    if (profilePicture && profilePicture.length > 0) {
      const filename = profilePicture[0].filename.toString();
      updatedCustomer.profilePicture = filename;
    }
  
    return await updatedCustomer.save();
  } */

  async remove(id: string) {
    await this.deleteFiles(id);
    return await this.customerModel.findByIdAndDelete(id);
  }
}
