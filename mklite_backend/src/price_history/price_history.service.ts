import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";

@Injectable()
export class PriceHistoryService {
    async getPriceHistory() {
        return await AppDataSource.manager.find("PriceHistory");
    }

    async addPriceEntry(entry: any) {
        return await AppDataSource.manager.save("PriceHistory", entry);
    }

    async getPriceEntryById(id: number) {
        return await AppDataSource.manager.findOneBy("PriceHistory", {id: id});
    }

    async deletePriceEntry(id: number) {
        return await AppDataSource.manager.delete("PriceHistory", {id: id});
    }

    async updatePriceEntry(id: number, entry: any) {
        return await AppDataSource.manager.update("PriceHistory", {id: id}, entry);
    }
}