import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUser {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginUser {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class User {
  @IsNumber()
  id: number;

  @IsString()
  @IsEmail()
  email: string;
}
