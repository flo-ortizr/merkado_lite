import { Controller, Delete, Get, Post, Param, Put } from "@nestjs/common";
import { Supplier } from "src/supplier/supplier.entity";
import { SupplierService } from "./supplier.service";

@Controller('/supplier')
export class SupplierController {
    constructor(private readonly supplierServie: SupplierService) {}

    @Post()
    createSupplier(supplier: Supplier) {
        this.supplierServie.createSupplier(supplier);
    }

    @Get()
    getAllSuppliers() {
        return this.supplierServie.getAllSuppliers();
    }

    @Get('/:id')
    getSupplierById(@Param() params: any) {
        return this.supplierServie.getSupplierById(params.id);
    }

    @Put('/:id')
    updateSupplier(@Param() params: any, supplier: Supplier) {
        return this.supplierServie.updateSupplier(params.id, supplier);
    }

    @Delete('/:id')
    deleteSupplier(@Param() params: any) {
        return this.supplierServie.deleteSupplier(params.id);
    }
}