import { Controller, Get } from "@nestjs/common";
import { ReturnService } from "./return.service";

@Controller('/return')
export class ReturnController {

    constructor(private readonly returnService: ReturnService) {}
    
    @Get()
    getReturns(){
        return this.returnService.getreturns();
    }
}