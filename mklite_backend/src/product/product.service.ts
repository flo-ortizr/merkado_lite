import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { Category } from '../category/category.entity';

@Injectable()
export class ProductService {
    async getAllProducts() {
        return await AppDataSource.manager.find("Product");
    }

    async getProductById(id: number) {
        return await AppDataSource.manager.findOneBy("Product", {id_product: id});
    }

    async getProductsByCategory(category: string) {
        return await AppDataSource.manager.find("Product", {where: {category: category}});
    }

    async getProductsBySupplier(id_supplier: number) {
        return await AppDataSource.manager.find("Product", {where: {supplier: {id_supplier: id_supplier}}});
    }
    //================================================ mostrar con su categoria 
    async getCatalogByCategory(categoryId: number) {
    const category = await AppDataSource.manager.findOne(Category, {
        relations: ['products'],
        where: {
            id_category: categoryId,
            products: {
                status: 'active'
            }
        }
    });
    
    return category;
    }

}