import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { Category } from '../category/category.entity';
import { Product } from "./product.entity";
import { Supplier } from "../supplier/supplier.entity";
import { CreateProductDto } from "./dto/create_product.dto";
import { UpdateProductDto } from "./dto/update_product.dto";

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
        return await AppDataSource.manager.find(Product, {
            relations: ['category']
        });
    }

    async getProductById(id: number) {
        return await AppDataSource.manager.findOne(Product, {
            where: { id_product: id },
            relations: ['category'],
        });
    }

    async createProduct(dto: CreateProductDto){
        const category = await AppDataSource.manager.findOne(Category, {where: {id_category: dto.id_category}});
        if(!category) throw new Error('Categoria no econtrada');

        const supplier = await AppDataSource.manager.findOne(Supplier, {where: {id_supplier: dto.id_supplier}});
        if(!supplier) throw new Error('Proveedor no econtrado');

        const product = AppDataSource.manager.create(Product, {
            name: dto.name,
            description: dto.description,
            price: dto.price,
            expiration_date: dto.expiration_date,
            status: dto.status || 'active',
            category: category,
            supplier: supplier,
            image_url: dto.image_url,
        });

        return await AppDataSource.manager.save(Product, product);
    }

    async updateProduct(id: number, dto: UpdateProductDto){
        const product = await AppDataSource.manager.findOne(Product, {where: {id_product: id}});
        if(!product) throw new Error('Producto no encontrado');

        if(dto.id_category){
            const category = await AppDataSource.manager.findOne(Category, {where: {id_category: dto.id_category}});
            if(!category) throw new Error('Categoria no econtrada');
            product.category = category;
        }

        if(dto.id_supplier){
            const supplier = await AppDataSource.manager.findOne(Supplier, {where: {id_supplier: dto.id_supplier}});
            if(!supplier) throw new Error('Proveedor no econtrado');
            product.supplier = supplier;
        }

        Object.assign(product, dto);
        
        return await AppDataSource.manager.save(Product, product);
    }

    async deleteProduct(id: number){
        const result = await AppDataSource.manager.delete(Product, {id_product: id});

        if(result.affected === 0) throw new Error('Producto no encontrado');

        return {message: 'Producto eliminado correctamente'};
    }
}