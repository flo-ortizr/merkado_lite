import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Param } from "@nestjs/common/decorators";

@Controller('/category')
export class CategoryController {
    
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    createCategory(category : any) {
        this.categoryService.createCategory(category);
    }   

    @Get()
    getAllCategories(){
        return this.categoryService.getAllCategories();
    }

    @Get('/:id')
    getCategoryById(@Param() params : any){
        return this.categoryService.getCategoryById(params.id);
    }   

    @Delete('/:id')
    deleteCategory(@Param() params : any){
        return this.categoryService.DeleteCategory(params.id);
    }   

    @Put('/:id')
    updateCategory(@Param() params : any, category : any){
        return this.categoryService.UpdateCategory(params.id, category);
    }
}