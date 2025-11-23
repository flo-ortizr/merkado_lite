// user.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/role.entity';

@Injectable()
export class UserService {
  async createUser(userData: Partial<User> & { roleId?: number }) {
    if (!userData) throw new Error('No se recibió data del usuario');

    // Usar roleId enviado en el body
    const roleId = userData.roleId || 1; // si no envían nada, asignar Cliente por defecto
    const role = await AppDataSource.manager.findOneBy(Role, { id_role: roleId });

    if (!role) throw new Error('Role no encontrado');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = AppDataSource.manager.create(User, {
      ...userData,
      password: hashedPassword,
      role, 
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

  async findByEmail(email: string) {
    return await AppDataSource.manager.findOneBy(User, { email });
  }

  async validateUser(email: string, password: string) {
  // Traer el usuario incluyendo la relación 'role'
  const user = await AppDataSource.manager.findOne(User, {
    where: { email },
    relations: ["role"], // <- esto es lo importante
  });

  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user; // ahora user.role estará disponible
}


  

}
