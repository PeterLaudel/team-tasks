import { Injectable } from '@nestjs/common';
import { CreateUser, User, UserRepository } from './userRepository';
import bcrypt from 'bcrypt';

type LoginUser = CreateUser;

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(private readonly userRespository: UserRepository) {}

  async createUser(user: CreateUser) {
    return this.userRespository.save({
      ...user,
      password: await bcrypt.hash(user.password, SALT_ROUNDS),
    });
  }

  async loginUser(user: LoginUser) {
    const foundUser = await this.userRespository.findByEmail(user.email);
    if (!foundUser) return false;

    const match = await bcrypt.compare(user.password, foundUser.password);
    if (!match) return false;

    return true;
  }

  async all() {
    return this.userRespository.all();
  }
}
