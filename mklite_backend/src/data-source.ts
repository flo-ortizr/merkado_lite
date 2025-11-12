import { DataSource } from "typeorm"
import { User } from "./user/user.entity"
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
    entities: [Role, User],
    subscribers: [],
    migrations: [],
})