import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Category } from 'src/category/category.entity';

@Injectable()
export class CategoryService {
    async createCategory(category: Category){
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

    async UpdateCategory(id: number, category: Category) {
        return await AppDataSource.manager.update(Category, {id_category: id}, category);
    }
}