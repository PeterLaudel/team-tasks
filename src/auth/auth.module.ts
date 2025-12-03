import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from './auth.service';
import { RepositoriesModule } from '../infrastructure/repositories/memory/repositories.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [UserService],
  imports: [
    RepositoriesModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
