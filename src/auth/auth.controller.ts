import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import express from 'express';
import { CreateUser, LoginUser, User } from './auth.dto';
import { UserService } from './auth.service';
import { Public } from './public';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() user: CreateUser): Promise<User> {
    return this.userService.createUser(user);
  }

  @Post('login')
  async login(
    @Body() loginUser: LoginUser,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken } =
      await this.userService.loginUser(loginUser);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const currentRefreshToken = req.cookies.refreshToken;

    const { accessToken, refreshToken } =
      await this.userService.refreshToken(currentRefreshToken);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { accessToken, refreshToken };
  }
}
