import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { ClsService } from "nestjs-cls";
import { Logger } from "src/lib/Logger/log4j.lib.logger";
import { PrismaService } from "src/prisma/prisma.service";
import { HealthController } from "./health.controller";
import { DBHealthIndicator } from "./prisma.health";

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [DBHealthIndicator, PrismaService, Logger],
})
export class HealthModule {}
