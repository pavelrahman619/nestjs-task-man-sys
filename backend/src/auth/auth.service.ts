import { SignUpDto } from './dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import * as argon from 'argon2';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  // async signIn() {
  //   return `User signed in with email`;
  // }
  async signUp(dto: SignUpDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          name: dto.name,
        },
      });

      return { success: true, data: user };
    } catch (error) {
      console.error('AuthService signUp error:', error);
      return {
        success: false,
        message: 'Failed to sign up user. Please try again later.',
      };
    }
  }
}
