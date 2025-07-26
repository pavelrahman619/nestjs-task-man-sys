import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // create sign in method
  async signIn(email: string, password: string) {
    return this.authService.signIn(email, password);
  }

  // create sign up method
  async signUp(email: string, password: string) {
    return this.authService.signUp(email, password);
  }
}
