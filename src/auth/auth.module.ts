import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from './auth.service';
import { RepositoriesModule } from '../infrastructure/repositories/memory/repositories.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [UserService, { provide: APP_GUARD, useClass: AuthGuard }],
  imports: [
    RepositoriesModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<number>('JWT_EXPIRATION_TIME') },
      }),
    }),
  ],
})
export class AuthModule {}
