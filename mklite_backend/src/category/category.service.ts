import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Category } from 'src/category/category.entity';
import { CreateCategoryDto } from './dto/create_category.dto';
import { UpdateCategoryDto } from './dto/update_category.dto';

@Injectable()
export class CategoryService {
    async createCategory(dto: CreateCategoryDto) {
        const category = AppDataSource.manager.create(Category, dto);
        return await AppDataSource.manager.save(Category, category);
    }

    async getAllCategories() {
        return await AppDataSource.manager.find(Category);
    }

    async getCategoryById(id: number) {
        return await AppDataSource.manager.findOneBy(Category, {id_category: id});
    }

    async DeleteCategory(id: number) {
        return await AppDataSource.manager.delete(Category, {id_category: id});
    }

    async UpdateCategory(id: number, dto: UpdateCategoryDto) {
        await AppDataSource.manager.update(Category, {id_category: id}, dto);
        return this.getCategoryById(id);
    }
}