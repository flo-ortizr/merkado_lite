import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { Supplier } from "src/supplier/supplier.entity";

@Injectable()
export class SupplierService {
    async createSupplier(supplier: Supplier) {
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

    async updateSupplier(id: number, supplier: Supplier) {
        return await AppDataSource.manager.update(Supplier, {id_supplier: id}, supplier);
    }
}