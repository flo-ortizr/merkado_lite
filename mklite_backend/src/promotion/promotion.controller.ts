import { Controller, Get, Post, Put, Delete, Param } from "@nestjs/common";
import { Promotion } from "src/promotion/promotion.entity";
import { PromotionService } from "./promotion.service";

@Controller('/promotion')
export class PromotionController {
    constructor(private readonly promotionService: PromotionService) {}

    @Get()
    getPromotions() {
        return this.promotionService.getPromotions();
    }

    @Get('/:id')
    getPromotionById(@Param() params: any) {
        return this.promotionService.getPromotionById(params.id);
    }

    @Post()
    createPromotion(promotion: Promotion) {
        return this.promotionService.createPromotion(promotion);
    }

    @Put('/:id')
    updatePromotion(@Param() params: any, promotion: Promotion) {
        return this.promotionService.updatePromotion(params.id, promotion);
    }

    @Delete('/:id')
    deletePromotion(@Param() params: any) {
        return this.promotionService.deletePromotion(params.id);
    }
}