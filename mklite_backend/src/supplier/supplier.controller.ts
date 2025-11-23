import { Controller, Delete, Get, Post, Param, Body, Put } from "@nestjs/common";
import { CreateSupplierDto } from "./dto/create_supplier.dto";
import { UpdateSupplierDto } from "./dto/update_supplier.dto";
import { SupplierService } from "./supplier.service";

@Controller('/supplier')
export class SupplierController {
    constructor(private readonly supplierServie: SupplierService) {}

    @Post()
    createSupplier(@Body() dto: CreateSupplierDto) {
        this.supplierServie.createSupplier(dto);
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
    updateSupplier(@Param('id') id: number, @Body() dto: UpdateSupplierDto) {
        return this.supplierServie.updateSupplier(id, dto);
    }

    @Delete('/:id')
    deleteSupplier(@Param() params: any) {
        return this.supplierServie.deleteSupplier(params.id);
    }
}