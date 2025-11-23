import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from 'src/data-source';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { Customer } from '../customer/customer.entity';
import { RegisterClientDto } from './dto/register_client.dto';
import { RegisterByAdminDto } from './dto/register_by_admin.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /** LOGIN */
  async login(email: string, password: string) {
    const user = await AppDataSource.manager.findOne(User, {
      where: { email },
      relations: ['role'],
    });

    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales incorrectas');

    const payload = {
      sub: user.id_user,
      email: user.email,
      role: user.role.name,
    };

    return {
      message: 'Inicio de sesión exitoso',
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  /** Registro normal — siempre Cliente */
  async registerClient(data: RegisterClientDto) {
    const exists = await AppDataSource.manager.findOne(User, { where: { email: data.email } });
    if (exists) throw new BadRequestException('El email ya existe');

    const password = await bcrypt.hash(data.password, 10);

    const clientRole = await AppDataSource.manager.findOne(Role, { where: { name: 'Cliente' } });
    if (!clientRole) throw new BadRequestException('No se encontró el rol Cliente');

    const user = AppDataSource.manager.create(User, { ...data, password, role: clientRole });
    const savedUser = await AppDataSource.manager.save(User, user);

    // Crear Customer automáticamente
    const customer = AppDataSource.manager.create(Customer, { user: savedUser });
    await AppDataSource.manager.save(Customer, customer);

    return savedUser;
  }

  /** Registro especial — solo Admin puede crear otros roles */
  async registerByAdmin(data: RegisterByAdminDto) {
    const exists = await AppDataSource.manager.findOne(User, { where: { email: data.email } });
    if (exists) throw new BadRequestException('El email ya existe');

    const role = await AppDataSource.manager.findOne(Role, { where: { name: data.roleName } });
    if (!role) throw new BadRequestException('El rol no existe');

    const password = await bcrypt.hash(data.password, 10);

    const user = AppDataSource.manager.create(User, { ...data, password, role });
    return await AppDataSource.manager.save(User, user);
  }
}
