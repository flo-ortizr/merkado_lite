import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { Category } from '../category/category.entity';
import { Product } from "./product.entity";

@Injectable()
export class ProductService {
    async getCatalog(){ //productos activos
        return await AppDataSource.manager.find(Product, {where: {status: 'active'}, relations: ['category']});
    }
    
    async getByCategory(categoryId: number) {
        return await AppDataSource.manager.find(Product, {
            where: {
                category: { id_category: categoryId },
                status: 'active'
            },
            relations: ['category']
        });
    }

    async searchProducts(query: string) {
        return await AppDataSource.manager
            .getRepository(Product)
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .where("product.name LIKE :q", { q: `%${query}%` })
            .andWhere("product.status = 'active'")
            .getMany();
    }

    async filterByPrice(min: number, max: number) {
        return await AppDataSource.manager
            .getRepository(Product)
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category")
            .where("product.price BETWEEN :min AND :max", { min, max })
            .andWhere("product.status = 'active'")
            .getMany();
    }

    async getAllProducts() {
        return await AppDataSource.manager.find(Product);
    }

    async getProductById(id: number) {
        return await AppDataSource.manager.findOneBy(Product, {id_product: id});
    }
}