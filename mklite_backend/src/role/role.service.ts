import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  async createRole(role: Role) {
    return await AppDataSource.manager.save(Role, role);
  }

  async getAllRoles() {
    return await AppDataSource.manager.find(Role);
  }

  async getRoleById(id: number) {
    return await AppDataSource.manager.findOneBy(Role, { id_role: id });
  }

  async updateRole(id: number, role: Role) {
    return await AppDataSource.manager.update(Role, { id_role: id }, role);
  }

  async deleteRole(id: number) {
    return await AppDataSource.manager.delete(Role, { id_role: id });
  }
}
