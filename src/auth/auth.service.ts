import { Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import {
  IUserRepository,
  CreateUser,
} from '../infrastructure/repositories/interfaces/user.repository';
import { JwtService } from '@nestjs/jwt';

type LoginUser = CreateUser;

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    private readonly userRespository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(user: CreateUser) {
    return this.userRespository.save({
      ...user,
      password: await bcrypt.hash(user.password, SALT_ROUNDS),
    });
  }

  async loginUser(user: LoginUser) {
    const foundUser = await this.userRespository.findByEmail(user.email);
    if (!foundUser) throw new NotFoundException();

    const match = await bcrypt.compare(user.password, foundUser.password);
    if (!match) throw new NotFoundException();

    const accessToken = this.jwtService.sign({
      id: foundUser.id,
      email: foundUser.email,
    });

    const refreshToken = this.jwtService.sign({}, { expiresIn: '7d' });

    const updatedUser = await this.userRespository.save({
      ...foundUser,
      refreshToken,
    });

    return {
      accessToken,
      refreshToken: updatedUser.refreshToken,
    };
  }
}
