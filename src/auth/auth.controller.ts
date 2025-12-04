import { Body, Controller, Get, Post } from '@nestjs/common';
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
  async login(@Body() loginUser: LoginUser) {
    return this.userService.loginUser(loginUser);
  }
}
