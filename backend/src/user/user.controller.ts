import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard, GetUser } from '../auth';
import { User } from 'generated/prisma';

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return {
      success: true,
      data: user,
    };
  }
}
