import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { Return } from "./return.entity";

@Injectable()
export class ReturnService {
    async getreturns(){
        return await AppDataSource.manager.find(Return);
    }
}