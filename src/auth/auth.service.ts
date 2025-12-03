import { Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { IUserRepository, CreateUser } from '../infrastructure/repositories/interfaces/user.repository';

type LoginUser = CreateUser;

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(private readonly userRespository: IUserRepository) {}

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

    return true;
  }

  async all() {
    return this.userRespository.all();
  }
}
