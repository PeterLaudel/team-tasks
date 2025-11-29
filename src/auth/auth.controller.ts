import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUser, LoginUser, User } from './auth.dto';
import { UserService } from './auth.service';
import { Log } from 'kysely';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() user: CreateUser): Promise<User> {
    return this.userService.createUser(user);
  }

  @Post('login')
  async login(@Body() loginUser: LoginUser) {
    const success = await this.userService.loginUser(loginUser);
    if (!success) {
      return { message: 'Invalid credentials' };
    }
    return { message: 'Login successful' };
  }

  @Get('users')
  async allUsers(): Promise<User[]> {
    return this.userService.all();
  }
}
