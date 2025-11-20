import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { Supplier } from "src/supplier/supplier.entity";
import { CreateSupplierDto } from "./dto/create_supplier.dto";
import { UpdateSupplierDto } from "./dto/update_supplier.dto";

@Injectable()
export class SupplierService {
    async createSupplier(dto: CreateSupplierDto){
        const supplier = AppDataSource.manager.create(Supplier, dto);
        return await AppDataSource.manager.save(Supplier, supplier);
    }

    async getAllSuppliers() {
        return await AppDataSource.manager.find(Supplier);
    }

    async getSupplierById(id: number) {
        return await AppDataSource.manager.findOneBy(Supplier, {id_supplier: id});
    }

    async deleteSupplier(id: number) {
        return await AppDataSource.manager.delete(Supplier, {id_supplier: id});
    }

    async updateSupplier(id: number, dto: UpdateSupplierDto) {
        await AppDataSource.manager.update(Supplier, { id_supplier: id }, dto);
        return this.getSupplierById(id);
    }
}