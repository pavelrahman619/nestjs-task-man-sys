
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  // Add signIn endpoint if needed
  // @Post('signin')
  // async signIn(@Body() dto: SignInDto) {
  //   return this.authService.signIn(dto);
  // }
}
