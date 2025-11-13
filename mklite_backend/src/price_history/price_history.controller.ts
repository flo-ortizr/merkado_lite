import { Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { PriceHistoryService } from "./price_history.service";

@Controller()
export class PriceHistoryController {
    constructor(private readonly priceHistoryService: PriceHistoryService) {}

    @Get('/price-history')
    getPriceHistory() {
        return this.priceHistoryService.getPriceHistory();
    }

    @Get('/price-history/entry/:id')
    getPriceEntryById(@Param() params: any) {
        return this.priceHistoryService.getPriceEntryById(params.id);
    }

    @Post('/price-history')
    addPriceEntry(entry: any) {
        return this.priceHistoryService.addPriceEntry(entry);
    }   

    @Delete('/price-history/entry/:id')
    deletePriceEntry(@Param() params: any) {
        return this.priceHistoryService.deletePriceEntry(params.id);
    }

    @Put('/price-history/entry/:id')
    updatePriceEntry(@Param() params: any, entry: any) {
        return this.priceHistoryService.updatePriceEntry(params.id, entry);
    }
}