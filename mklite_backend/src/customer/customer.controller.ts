import { Controller, Get, Post, Delete, Put, Param } from '@nestjs/common';
import { Customer } from 'src/customer/customer.entity';
import { CustomerService } from './customer.service';

@Controller ('/customer')
export class CustomerController {
    
    constructor(private readonly customerService: CustomerService) {}
    
    @Post()
    createCustomer(customer : Customer) {
        this.customerService.createCustomer(customer);
    }

    @Get()
    getAllCustomers(){
        return this.customerService.getAllCustomers();
    }

    @Get('/:id')
    getCustomerById(@Param() params : any){
        return this.customerService.getCustomerById(params.id);
    }

    @Delete('/:id')
    deleteCustomer(@Param() params : any){
        return this.customerService.DeleteCustomer(params.id);
    }

    @Put('/:id')
    updateCustomer(@Param() params : any, customer : Customer){
        return this.customerService.UpdateCustomer(params.id, customer);
    }
}