import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller('/product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('/catalog')
    getCatalog() {
        return this.productService.getCatalog();
    }

    @Get('/category/:id')
    getByCategory(@Param('id') id: number) {
        return this.productService.getByCategory(id);
    }

    @Get('/search')
    search(@Query('q') query: string) {
        return this.productService.searchProducts(query);
    }

    @Get('/filter/price')
    filterByPrice(@Query('min') min: number, @Query('max') max: number) {
        return this.productService.filterByPrice(min, max);
    }

    @Get()
    getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Get('/:id')
    getProductById(@Param('id') id: number) {
        return this.productService.getProductById(id);
    }
}