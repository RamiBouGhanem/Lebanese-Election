import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard'; // ✅ Import the guard

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async signup(@Body() body: { username: string; password: string; role: string }) {
    return this.authService.signup(body.username, body.password, body.role);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    return this.authService.login(user);
  }

  // ✅ New verify endpoint
  @Get('verify')
  @UseGuards(JwtAuthGuard)
  verify(@Request() req) {
    return { user: req.user }; // returns the user info from the token
  }
}
