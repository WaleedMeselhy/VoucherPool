import { Controller, Get, UseInterceptors, VERSION_NEUTRAL } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
} from "@nestjs/terminus";
import { DBHealthIndicator } from "./prisma.health";
import { TraceInterceptor } from "src/interceptor/trace.interceptor";
import { LoggingInterceptor } from "src/interceptor/request-logger.interceptor";
@Controller({ path: "health", version: VERSION_NEUTRAL })
@UseInterceptors(LoggingInterceptor)
@UseInterceptors(TraceInterceptor)
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dbHealthIndicator: DBHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        this.dbHealthIndicator.isHealthy(),
    ]);
  }
}
