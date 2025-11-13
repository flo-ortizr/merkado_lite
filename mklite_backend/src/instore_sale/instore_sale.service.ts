import { Injectable } from '@nestjs/common';
import { InStoreSale } from './instore_sale.entity';
import { AppDataSource } from "src/data-source";

@Injectable()
export class InstoreSaleService {
    async createInstoreSale(instoresale: InStoreSale){
        return await AppDataSource.manager.save(InStoreSale, instoresale);
    }

    async getAllInstoreSales(){
        return await AppDataSource.manager.find(InStoreSale);
    }

    async getInstoreSaleById(id: number){
        return await AppDataSource.manager.findOneBy(InStoreSale, {id_sale: id});
    }

    async deleteInstoreSale(id: number){
        return await AppDataSource.manager.delete(InStoreSale, {id_instore_sale: id});
    }

    async updateInstoreSale(id: number, instoresale: InStoreSale){
        return await AppDataSource.manager.update(InStoreSale, {id_sale: id}, instoresale);
    }   
}