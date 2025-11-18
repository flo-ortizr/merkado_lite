import {Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/register.dto';

@Controller('/user')
export class UserController {
    
    constructor(private readonly userService: UserService) {}
    
   @Post()
   async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

    @Get()
    getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Get('/:id')
    getUserById(@Param() params : any){
        return this.userService.getUserById(params.id);
    }

    @Delete('/:id')
    deleteUser(@Param() params : any){
        return this.userService.DeleteUser(params.id);
    }

    @Put('/:id')
  updateUser(
    @Param('id') id: number,
    @Body() userData: Partial<CreateUserDto>) {
    return this.userService.UpdateUser(id, userData);
  }
}