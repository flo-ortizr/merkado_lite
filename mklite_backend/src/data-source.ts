import { DataSource } from "typeorm"
import { User } from "./entity/user.entity"
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "merkado_admin",
    password: "1234",
    database: "mklite",
    synchronize: true,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
})