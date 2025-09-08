import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

type DbUser = { _id: any; username: string; role: string; password?: string };

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<DbUser> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { _id: user._id, username: user.username, role: user.role };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async signup(username: string, password: string, role: string) {
    const existing = await this.usersService.findByUsername(username);
    if (existing) throw new UnauthorizedException('المستخدم موجود بالفعل');
    const newUser = await this.usersService.create(username, password, role);
    return this.login({ _id: newUser._id, username: newUser.username, role: newUser.role });
  }

  async login(user: { _id: any; username: string; role: string }) {
    const payload = { sub: String(user._id), username: user.username, role: user.role };
    const jwt = this.jwtService.sign(payload);
    return {
      token: jwt,
      access_token: jwt,
      user: {
        id: String(user._id),
        _id: String(user._id),
        username: user.username,
        role: user.role,
      },
    };
  }
}
