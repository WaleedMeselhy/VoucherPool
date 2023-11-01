import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  Query,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { LoggingInterceptor } from "../interceptor/request-logger.interceptor";
import { TraceInterceptor } from "../interceptor/trace.interceptor";
import {
  VerifyOrRedeemDTO,
  VoucherCodeBulkCreateDTO,
  VoucherCodeDTO,
  VoucherUsageDTO,
} from "src/dto/voucher-code.dto";
import { VoucherCodeService } from "src/service/voucher-code.service";

@ApiTags("VoucherCode")
@Controller({ path: "voucher-code", version: "1" })
@UseInterceptors(LoggingInterceptor)
@UseInterceptors(TraceInterceptor)
export class VoucherCodeController {
  constructor(private readonly voucherCodeService: VoucherCodeService) {}

  @ApiOkResponse({
    description: "get all voucher codes",
    type: VoucherCodeDTO,
    isArray: true,
  })
  @Get()
  async list(): Promise<VoucherCodeDTO[]> {
    return await this.voucherCodeService.list();
  }

  @ApiCreatedResponse({
    description: "create coucher code",
    type: VoucherCodeDTO,
  })
  @Post()
  async create(@Body() bodyParam: VoucherCodeDTO): Promise<VoucherCodeDTO> {
    return await this.voucherCodeService.create(bodyParam);
  }

  @ApiCreatedResponse({
    description: "create coucher code",
    type: VoucherCodeDTO,
    isArray: true,
  })
  @Post("/bulk-create")
  async bulkCreate(
    @Body() bodyParam: VoucherCodeBulkCreateDTO
  ): Promise<VoucherCodeDTO[]> {
    return await this.voucherCodeService.bulkCreate(bodyParam);
  }

  @Get("/verify")
  async verify(
    @Query() queryParams: VerifyOrRedeemDTO
  ): Promise<VoucherCodeDTO> {
    return await this.voucherCodeService.verify(queryParams);
  }

  @Post("/redeem")
  async geredeemt(@Body() bodyParam: VerifyOrRedeemDTO): Promise<VoucherUsageDTO> {
    return await this.voucherCodeService.redeem(bodyParam);
  }
}
