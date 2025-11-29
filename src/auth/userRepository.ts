import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  email: string;
  password: string;
}

export type CreateUser = Omit<User, 'id'>;

@Injectable()
export class UserRepository {
  private users: User[] = [];

  async save(user: CreateUser): Promise<User> {
    const newUser: User = {
      id: this.users.length + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);
    return user;
  }

  async all() {
    return Promise.resolve(this.users);
  }
}
