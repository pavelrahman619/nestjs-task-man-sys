import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface SignInDto {
  email: string;
  password: string;
}

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}
