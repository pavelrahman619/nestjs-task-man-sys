import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // create sign in and sign up methods
  async signIn(email: string, password: string): Promise<string> {
    // Logic for signing in a user
    return `User signed in with email: ${email}`;
  }
  async signUp(email: string, password: string): Promise<string> {
    // Logic for signing up a user
    return `User signed up with email: ${email}`;
  }
}
