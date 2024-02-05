import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewUserDto } from './dto/new-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NewUser, NewUserDocument } from './schemas/new-user.schema';
import * as fs from 'fs';
import { join } from 'path';
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';

@Injectable()
export class NewUserService {
  constructor(
    @InjectModel('NewUser')
    private readonly newUserModel: Model<NewUserDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  private async sendWelcomeEmail(
    username: string,
    email: string,
  ): Promise<void> {
    // Use Ethereal for testing emails
    const PB_email = 'communication@purposeblack.et';
    const pass = 'com@pbeth@2023';
    try {
      const testAccount = await createTestAccount();

      const transporter = createTransport({
        // host: 'smtp.ethereal.email',
        host: 'mail.ethionet.et',
        // port: 587,
        port: 465,
        // secure: false,
        secure: false,
        // auth: {
        //     user: testAccount.user,
        //     pass: testAccount.pass,
        // },
        auth: {
          user: PB_email,
          pass: pass,
        },

        // tls: {
        //     rejectUnauthorized: false,
        // },
        // pool: true,
        // maxMessages: Infinity,
        // maxConnections: 20,
      });

      const mailOptions = {
        from: PB_email,
        to: email,
        subject: 'Welcome to Your App, PB Credit',
        text: `Hello ${username},\n\nYour account is on review.\n\nWe will contact you soon.\n\nThank you for your interest.`,
      };

      const info = await transporter.sendMail(mailOptions);

      // console.log('Preview URL: %s', getTestMessageUrl(info));
      console.log('Send mail function response: ', info);
    } catch (err) {
      console.log('Email service error: ', err);
    }
  }

  async uploadFiles(files: Array<Express.Multer.File>, id: string) {
    try {
      const newUser = await this.newUserModel.findById(id);

      newUser.documents.ID = files[0][0].filename;
      newUser.documents.TIN = files[1][0].filename;
      newUser.documents.License = files[2][0].filename;
      newUser.documents.R_Cert = files[3][0].filename;

      console.log('new-user: ', newUser);

      return await this.newUserModel.findByIdAndUpdate(id, newUser, {
        new: true,
      });
    } catch (error) {
      return error;
    }
  }

  // async create(createNewUserDto: CreateNewUserDto,profilePicture: Array<Express.Multer.File>) {
  //     this.sendWelcomeEmail(createNewUserDto.name, createNewUserDto.email)
  //     const newUser = new this.newUserModel(createNewUserDto);
  //     const  filename= profilePicture[0][0].filename;
  //     newUser.profilePicture = filename

  //     console.log(newUser)

  //     return await newUser.save();
  // }
  async create(createNewUserDto: CreateNewUserDto) {
    this.sendWelcomeEmail(createNewUserDto.name, createNewUserDto.email);
    const newUser = new this.newUserModel(createNewUserDto);

    // console.log('newUser created');
    const nUser = await newUser.save();
    const userCreatedEvent = new UserCreatedEvent();

    userCreatedEvent.name = nUser.name;
    userCreatedEvent.description = nUser.email;
    this.eventEmitter.emit('order.created', userCreatedEvent);

    return nUser;
  }
  async findAll() {
    return await this.newUserModel.find();
  }

  async findOne(id: string) {
    console.log('Find One: ', await this.newUserModel.findOne({ _id: id }));
    return await this.newUserModel.findOne({ _id: id });
  }

  async update(id: string, updateNewUserDto: CreateNewUserDto) {
    const updatedUser = await this.newUserModel.findByIdAndUpdate(
      id,
      updateNewUserDto,
      { new: true },
    );
    console.log('Update: ', updatedUser);
    return updatedUser;
  }

  async delete(id: string) {
    const user = await this.findOne(id);
    if (user) {
      const imgId = user.documents.ID;
      const imgLicense = user.documents.License;
      const imgTin = user.documents.TIN;
      const imgReg = user.documents.R_Cert;

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
          // throw new NotFoundException(`File ${imgNames[index]} not found.`);
        }
      });
    }
    return await this.newUserModel.findByIdAndRemove(id);
  }
}
