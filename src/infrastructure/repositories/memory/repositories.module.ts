import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUserRepository } from '../interfaces/user.repository';

@Module({
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [IUserRepository],
})
export class RepositoriesModule {}
