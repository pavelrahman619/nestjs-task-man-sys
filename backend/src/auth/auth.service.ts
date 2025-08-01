import { SignUpDto, SignInDto } from './dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as argon from 'argon2';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signIn(dto: SignInDto) {
    try {
      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      // Check if user exists
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Verify password
      const passwordMatch = await argon.verify(user.password, dto.password);
      if (!passwordMatch) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      // Generate JWT token
      const token = this.jwt.sign({ sub: user.id, email: user.email });

      return {
        success: true,
        data: {
          user: userWithoutPassword,
          access_token: token,
        },
        message: 'Sign in successful',
      };
    } catch (error) {
      console.error('AuthService signIn error:', error);
      return {
        success: false,
        message: 'Failed to sign in. Please try again later.',
      };
    }
  }

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

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      // Generate JWT token
      const token = this.jwt.sign({ sub: user.id, email: user.email });

      return {
        success: true,
        data: {
          user: userWithoutPassword,
          access_token: token,
        },
      };
    } catch (error) {
      console.error('AuthService signUp error:', error);
      return {
        success: false,
        message: 'Failed to sign up user. Please try again later.',
      };
    }
  }
}
