import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { UserDocument } from './schemas/user.schema';
import { ChangePasswordDto } from './dto/change-password.dto';
import { createTestAccount, createTransport, getTestMessageUrl } from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  private async sendWelcomeEmail(username: string, email: string, password: string): Promise<void> {
      // Use Ethereal for testing emails
    try {
      const testAccount = await createTestAccount();

      const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const mailOptions = {
        from: 'pbcredit@purposeblacketh.com',
        to: email,
        subject: 'Welcome to Your App, PB Credit',
        text: `Hello ${username},\n\nYour account has been created!\n\nEmail: ${email}\nPassword: ${password}`,
      };

      const info = await transporter.sendMail(mailOptions);

      console.log('Preview URL: %s', getTestMessageUrl(info));
    } catch (err) {
      console.log('Email service error: ', err)
    }
      
  }

  async validateUser(loginDto: LoginDto): Promise<UserDocument | null> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<UserDocument[] | null> {
    try {
      const users = await this.userModel.find();

      if (!users) {
        return null;
      }

      return users;
    } catch (error) {
      return null;
    }
  }

  async findOne(email: string): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  async findById(id: string): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userId: string,
  ): Promise<UserDocument | Error> {
    try {
      const { oldPassword, password } = changePasswordDto;

      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user.password = hashedPassword;

      await user.save();

      return user;
    } catch (error) {
      return error;
    }
  }

  async signUp(signUpDto: SignupDto): Promise<UserDocument | Error> {
    try {
      const { name, email, password, phone, role } = signUpDto;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new this.userModel({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
      });

      const resp = await newUser.save(); 
      if (resp) {
        this.sendWelcomeEmail(name, email, password);
      }

      return resp;

    } catch (error) {
      return error;
    }
  }
}
