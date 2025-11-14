import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { User } from 'src/user/user.entity';

@Injectable()
export class UserService {
  async createUser(user: User){
    return await AppDataSource.manager.save(User, user);
  }

  async getAllUsers() {
    return await AppDataSource.manager.find(User);
  }

  async getUserById(id: number) {
    return await AppDataSource.manager.findOneBy(User, {id_user: id});
  }

  async DeleteUser(id: number) {
    return await AppDataSource.manager.delete(User, {id_user: id});
  }

  async UpdateUser(id: number, user: User) {
    return await AppDataSource.manager.update(User, {id_user: id}, user);
  }
}