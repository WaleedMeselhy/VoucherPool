import { Controller, Get, Post, Body, UseInterceptors } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CustomerDTO } from "src/dto/customer.dto";
import { LoggingInterceptor } from "../interceptor/request-logger.interceptor";
import { TraceInterceptor } from "../interceptor/trace.interceptor";
import { CustomerService } from "../service/customer.service";

@ApiTags("Customer")
@Controller({ path: "customer", version: "1" })
@UseInterceptors(LoggingInterceptor)
@UseInterceptors(TraceInterceptor)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOkResponse({
    description: "get all customers",
    type: CustomerDTO,
    isArray: true,
  })
  @Get()
  async list(): Promise<CustomerDTO[]> {
    return await this.customerService.list();
  }

  @ApiOkResponse({
    description: "create customer",
    type: CustomerDTO,
  })
  @Post()
  async create(@Body() bodyParam: CustomerDTO): Promise<CustomerDTO> {
    return await this.customerService.create(bodyParam);
  }
}
