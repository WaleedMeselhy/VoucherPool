import { Module } from "@nestjs/common";
import { Logger } from "../lib/Logger/log4j.lib.logger";
import { AxiosHttpClient } from "../lib/http/impl/axios.lib.http";
import { PrismaModule } from "src/prisma/prisma.module";
import { HealthModule } from "../health/health.module";
import { CustomerService } from "../service/customer.service";
import { CustomerRepository } from "../repositories/customer.repository";
import { CustomerController } from "../controller/customer.controller";
import { SpecialOfferController } from "src/controller/special-offer.controller";
import { SpecialOfferService } from "src/service/special-offer.service";
import { SpecialOfferRepository } from "src/repositories/special-offer.repository";
import { VoucherCodeController } from "src/controller/voucher-code.controller";
import { VoucherCodeService } from "src/service/voucher-code.service";
import { VoucherCodeRepository } from "src/repositories/voucher-code.repository";
import { ClsModule } from "nestjs-cls";
import { ThrottlerGuard, ThrottlerModule, seconds } from "@nestjs/throttler";
import { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis";
import { Config } from "src/configs/config";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        { limit: Config.RATE_LIMIT_MAX, ttl: seconds(Config.RATE_LIMIT_TTL) },
      ],
      storage: new ThrottlerStorageRedisService({
        host: Config.REDIS_HOST,
        port: Config.REDIS_PORT,
      }),
    }),
    ClsModule.register({
      global: true,
      interceptor: { generateId: true, mount: true },
    }),
    PrismaModule,
    HealthModule,
  ],
  controllers: [
    CustomerController,
    SpecialOfferController,
    VoucherCodeController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CustomerService,
    SpecialOfferService,
    VoucherCodeService,
    Logger,
    {
      provide: "httpClient",
      useClass: AxiosHttpClient,
    },
    CustomerRepository,
    SpecialOfferRepository,
    VoucherCodeRepository,
  ],
})
export class App {}
