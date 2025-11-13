import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  createRole(@Body() role: Role) {
    return this.roleService.createRole(role);
  }

  @Get()
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Get('/:id')
  getRoleById(@Param('id') id: number) {
    return this.roleService.getRoleById(id);
  }

  @Put('/:id')
  updateRole(@Param('id') id: number, @Body() role: Role) {
    return this.roleService.updateRole(id, role);
  }

  @Delete('/:id')
  deleteRole(@Param('id') id: number) {
    return this.roleService.deleteRole(id);
  }
}
