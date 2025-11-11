import {Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
    
    constructor(private readonly userService: UserService) {}
    
    @Post()
    createUser(user : User) {
        this.userService.createUser(user);
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
    updateUser(@Param() params : any, user : User){
        return this.userService.UpdateUser(params.id, user);
    }
}
