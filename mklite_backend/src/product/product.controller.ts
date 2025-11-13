import { Controller, Get, Param } from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller('/product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Get('/:id')
    getProductById(@Param() params: any) {
        return this.productService.getProductById(params.id);
    }

    @Get('/category/:category')
    getProductsByCategory(@Param() params: any) {
        return this.productService.getProductsByCategory(params.category);
    }

    @Get('/supplier/:id_supplier')
    getProductsBySupplier(@Param() params: any) {
        return this.productService.getProductsBySupplier(params.id_supplier);
    }
}