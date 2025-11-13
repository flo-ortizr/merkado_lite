import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(user: User) {
    return this.userRepo.save(user);
  }

  async getAllUsers() {
    return this.userRepo.find({ relations: ['role', 'customer', 'sales', 'logs', 'notifications'] });
  }

  async getUserById(id: number) {
    return this.userRepo.findOne({ where: { id_user: id } });
  }

  async deleteUser(id: number) {
    return this.userRepo.delete({ id_user: id });
  }

  async updateUser(id: number, user: User) {
    return this.userRepo.update({ id_user: id }, user);
  }
}
