import { Controller, Delete, Get, Post, Put, Body } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create_category.dto";
import { UpdateCategoryDto } from "./dto/update_category.dto";
import { CategoryService } from "./category.service";
import { Param } from "@nestjs/common/decorators";

@Controller('/category')
export class CategoryController {
    
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    createCategory(@Body() dto: CreateCategoryDto){
        this.categoryService.createCategory(dto);
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
    updateCategory(@Param('id') id: number, @Body() dto: UpdateCategoryDto){
        return this.categoryService.UpdateCategory(id, dto);
    }
}