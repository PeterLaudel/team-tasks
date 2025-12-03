import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  email: string;
  password: string;
  refreshToken?: string;
}

export type CreateUser = Omit<User, 'id'>;

@Injectable()
export abstract class IUserRepository {
  abstract save(user: CreateUser): Promise<User>;
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract all(): Promise<User[]>;
}
