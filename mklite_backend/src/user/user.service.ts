// user.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  async getAllUsers() {
    return await AppDataSource.manager.find(User);
  }

  async getUserById(id: number) {
    return await AppDataSource.manager.findOneBy(User, { id_user: id });
  }

  async DeleteUser(id: number) {
    return await AppDataSource.manager.delete(User, { id_user: id });
  }

  async findByEmail(email: string) {
    return await AppDataSource.manager.findOneBy(User, { email });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }
}
