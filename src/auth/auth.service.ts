import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(res: Response, userId: any) {
    const token = this.jwtService.sign({ userId });
    
    res.cookie('jwt', token, {
      httpOnly: false,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === 'prod',
    });
    return token;
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userService.validateUser(loginDto);

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  async signup(signupDto: SignupDto) {
    return await this.userService.signUp(signupDto);
  }

  async changePassword(changePasswordDto: ChangePasswordDto, jwt: string) {
    const { userId } = this.jwtService.decode(jwt) as { userId: any };

    return await this.userService.changePassword(changePasswordDto, userId);
  }

  async findUser(email: string) {
    return await this.userService.findOne(email);
  }

  async findOne(id: string) {
    return await this.userService.findById(id);
  }

  async findAll() {
    return await this.userService.findAll();
  }
}
