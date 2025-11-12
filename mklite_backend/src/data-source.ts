import { DataSource } from "typeorm"
import { User } from "./user/user.entity"
import { Customer } from "./customer/customer.entity"
import { Product } from "./product/product.entity"
import { Category } from "./category/category.entity"
import { Role } from "./role/role.entity"
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 5432,
    username: "merkado_admin",
    password: "1234",
    database: "mklite",
    synchronize: true,
    logging: true,
    entities: [Role, User, Customer, Product, Category],
    subscribers: [],
    migrations: [],
})