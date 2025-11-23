// user.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { User } from './user.entity';
import { Customer } from '../customer/customer.entity';
import { Role } from '../role/role.entity';
import { CreateUserDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  async createUser(data: CreateUserDto) {
    // 1. Verificar email duplicado
    const existing = await AppDataSource.manager.findOneBy(User, {
      email: data.email,
    });

    if (existing) {
      throw new BadRequestException('El email ya esta registrado');
    }

    // 2. Hashear password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Buscar rol "cliente"
    const clientRole = await AppDataSource.manager.findOneBy(Role, {
      name: 'Cliente',
    });

    if (!clientRole) {
      throw new BadRequestException(
        'No se encontro el rol cliente. Debes crearlo en la tabla ROLE'
      );
    }

    // 4. Crear usuario con rol cliente
    const newUser = AppDataSource.manager.create(User, {
      ...data,
      password: hashedPassword,
      role: clientRole,
    });

    const savedUser = await AppDataSource.manager.save(User, newUser);
    // ⭐ 5. Crear automáticamente su Customer
    const newCustomer = AppDataSource.manager.create(Customer, {
    user: savedUser
 });

  await AppDataSource.manager.save(Customer, newCustomer);
  return savedUser;
  }

  async getAllUsers() {
    return AppDataSource.manager.find(User);
  }

  async getUserById(id: number) {
    return AppDataSource.manager.findOneBy(User, { id_user: id });
  }

  async DeleteUser(id: number) {
    return AppDataSource.manager.delete(User, { id_user: id });
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
