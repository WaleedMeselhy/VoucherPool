import { Controller, Post, Get, Body, UseInterceptors } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { LoggingInterceptor } from "../interceptor/request-logger.interceptor";
import { TraceInterceptor } from "../interceptor/trace.interceptor";
import { SpecialOfferService } from "src/service/special-offer.service";
import { SpecialOfferDTO } from "src/dto/special-offer.dto";

@ApiTags("SpecialOffer")
@Controller({ path: "special-offer", version: "1" })
@UseInterceptors(LoggingInterceptor)
@UseInterceptors(TraceInterceptor)
export class SpecialOfferController {
  constructor(private readonly specialOfferService: SpecialOfferService) {}

  @ApiOkResponse({
    description: "get all special offers",
    type: SpecialOfferDTO,
    isArray: true,
  })
  @Get()
  async list(): Promise<SpecialOfferDTO[]> {
    return await this.specialOfferService.list();
  }

  @ApiCreatedResponse({
    description: "create special offer",
    type: SpecialOfferDTO,
  })
  @Post()
  async create(@Body() bodyParam: SpecialOfferDTO): Promise<SpecialOfferDTO> {
    return await this.specialOfferService.create(bodyParam);
  }
}
