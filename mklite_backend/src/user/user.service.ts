import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/role.entity';
import { Not } from 'typeorm';

@Injectable()
export class UserService {

  // CREATE
  async createUser(userData: Partial<User> & { roleId?: number }) {
    if (!userData) throw new Error('No se recibió data del usuario');

    const roleId = userData.roleId || 1; // Cliente por defecto
    const role = await AppDataSource.manager.findOneBy(Role, { id_role: roleId });

    if (!role) throw new Error('Role no encontrado');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = AppDataSource.manager.create(User, {
      ...userData,
      password: hashedPassword,
      role,
      status: "active" // ← como en tu ejemplo real
    });

    return await AppDataSource.manager.save(User, user);
  }

  // LISTAR (excepto CLIENTE)
  async getAllUsers() {
    return await AppDataSource.manager.find(User, {
      relations: ["role"],
      where: {
        role: {
          id_role: Not(1), // excluir Cliente
        }
      }
    });
  }

  // GET BY ID
  async getUserById(id: number) {
    return await AppDataSource.manager.findOne(User, {
      where: { id_user: id },
      relations: ["role"],
    });
  }

  // DISABLE USER (NO DELETE)
  async deleteUser(id: number) {
    const user = await AppDataSource.manager.findOneBy(User, { id_user: id });

    if (!user) throw new BadRequestException("Usuario no encontrado");

    user.status = "inactive"; // ← coincide con tu BD

    return await AppDataSource.manager.save(User, user);
  }

  // FIND EMAIL
  async findByEmail(email: string) {
    return await AppDataSource.manager.findOneBy(User, { email });
  }

  // VALIDATE USER
  async validateUser(email: string, password: string) {
    const user = await AppDataSource.manager.findOne(User, {
      where: { email },
      relations: ["role"],
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }
  // UPDATE USER (CAMBIAR DATOS)
async updateUser(id: number, userData: Partial<User>) {
  const user = await AppDataSource.manager.findOneBy(User, { id_user: id });

  if (!user) throw new BadRequestException("Usuario no encontrado");

  // Si mandan password, lo hasheamos
  if (userData.password) {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
  }

  // Actualizar los demás campos
  AppDataSource.manager.merge(User, user, userData);

  return await AppDataSource.manager.save(User, user);
}

}
