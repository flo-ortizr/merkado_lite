import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";

@Injectable()
export class InStoreSaleDetailService {
    async exampleMethod() {
        return "This is an example method in InStoreSaleDetailService";
    }
}