import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return { username: user.username, role: user.role };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async signup(username: string, password: string, role: string) {
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new UnauthorizedException('المستخدم موجود بالفعل');
    }
    const newUser = await this.usersService.create(username, password, role);
    return this.login(newUser); 
  }

  async login(user: any) {
    const payload = { username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
