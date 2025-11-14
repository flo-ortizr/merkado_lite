// user.service.ts
import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { User } from './user.entity';
import { Role } from '../role/role.entity';

@Injectable()
export class UserService {
  async createUser(userData: Partial<User>) {
    if (!userData) throw new Error('No se recibió data del usuario');

    // Buscar rol Cliente
    const role = await AppDataSource.manager.findOneBy(Role, { id_role: 1 });
    if (!role) throw new Error('Role no encontrado');

    // Crear entidad User
    const user = AppDataSource.manager.create(User, {
      ...userData,
      role, // asignamos entidad
    });

    return await AppDataSource.manager.save(User, user);
  }

  async getAllUsers() {
    return await AppDataSource.manager.find(User);
  }

  async getUserById(id: number) {
    return await AppDataSource.manager.findOneBy(User, { id_user: id });
  }

  async DeleteUser(id: number) {
    return await AppDataSource.manager.delete(User, { id_user: id });
  }

  async UpdateUser(id: number, userData: Partial<User>) {
    return await AppDataSource.manager.update(User, { id_user: id }, userData);
  }
}
