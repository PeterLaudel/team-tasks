import {
  CreateUser,
  IUserRepository,
  User,
} from '../interfaces/user.repository';

export class UserRepository implements IUserRepository {
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

  async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.refreshToken === refreshToken);
    return user;
  }

  async all() {
    return Promise.resolve(this.users);
  }
}
