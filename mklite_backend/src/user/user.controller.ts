import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('/user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  // CREATE USER
  @Post()
  createUser(@Body() userData: Partial<User> & { roleId?: number }) {
    return this.userService.createUser(userData);
  }

  // LISTAR USUARIOS (excepto Cliente)
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // GET BY ID
  @Get('/:id')
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  // UPDATE USER
  @Put('/:id')
  updateUser(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
  ) {
    return this.userService.updateUser(id, userData);
  }

  // DISABLE USER
  @Delete('/:id')
  disableUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
