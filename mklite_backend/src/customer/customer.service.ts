import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Customer } from 'src/customer/customer.entity';

@Injectable()
export class CustomerService {
  async createCustomer(customer: Customer){
    return await AppDataSource.manager.save(Customer, customer);
  }

  async getAllCustomers() {
    return await AppDataSource.manager.find(Customer);
  }

  async getCustomerById(id: number) {
    return await AppDataSource.manager.findOneBy(Customer, {id_customer: id});
  }

  async DeleteCustomer(id: number) {
    return await AppDataSource.manager.delete(Customer, {id_customer: id});
  }

  async UpdateCustomer(id: number, customer: Customer) {
    return await AppDataSource.manager.update(Customer, {id_customer: id}, customer);
  }
}
