import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(loginDto);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const jwt = this.authService.generateToken(res, user._id);
    // console.log(jwt)

    return res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      jwt,
    });
  }

  @Post('signup')
  async signup(@Body() SignupDto: SignupDto, @Res() res: Response) {
    try {
      if (1 == 1) {
        res.status(403);
        throw new UnauthorizedException('User Testing');
      }
      const userExists = await this.authService.findUser(SignupDto.email);

      if (userExists) {
        res.status(403);
        throw new UnauthorizedException('User already exists');
      }

      const user = await this.authService.signup(SignupDto);

      if (user instanceof Error) {
        throw new UnauthorizedException(user.message);
      }

      this.authService.generateToken(res, user._id);

      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() ChangePasswordDto: ChangePasswordDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const user = await this.authService.changePassword(
        ChangePasswordDto,
        req.cookies['jwt'],
      );

      if (user instanceof Error) {
        throw new UnauthorizedException(user.message);
      }

      res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}
