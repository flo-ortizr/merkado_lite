
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { InStoreSale } from './instore_sale.entity';
import { InstoreSaleService } from './instore_sale.service';

@Controller('instore-sale')
export class InstoreSaleController {
    constructor(private readonly instoreSaleService: InstoreSaleService) {}

    @Post()
    async createInstoreSale(@Body() instoresale: InStoreSale) {
        return await this.instoreSaleService.createInstoreSale(instoresale);
    }

    @Get()
    async getAllInstoreSales() {
        return await this.instoreSaleService.getAllInstoreSales();
    }

    @Get(':id')
    async getInstoreSaleById(@Param('id') id: number) {
        return await this.instoreSaleService.getInstoreSaleById(id);
    }

    @Delete(':id')
    async deleteInstoreSale(@Param('id') id: number) {
        return await this.instoreSaleService.deleteInstoreSale(id);
    }

    @Put(':id')
    async updateInstoreSale(@Param('id') id: number, @Body() instoresale: InStoreSale) {
        return await this.instoreSaleService.updateInstoreSale(id, instoresale);
    }
}