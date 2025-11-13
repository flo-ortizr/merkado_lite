import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";

@Injectable()
export class InventoryService {
    async getInventoryStatus() {
        return { status: "Inventory service is running" };
    }
}