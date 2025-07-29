import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }

  async create(username: string, password: string, role: string): Promise<User> {
    // التحقق من عدم وجود المستخدم مسبقاً
    const existing = await this.findByUsername(username);
    if (existing) {
      throw new BadRequestException('المستخدم موجود بالفعل');
    }

    // Hash كلمة السر وإنشاء المستخدم
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hashedPassword, role });
    const saved = await user.save();
    console.log(`✅ User "${username}" created with role "${role}"`);
    return saved;
  }
}
