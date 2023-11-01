import { Module } from "@nestjs/common";
import { ClsModule } from "nestjs-cls";
import { Logger } from "src/lib/Logger/log4j.lib.logger";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [],
  providers: [PrismaService, Logger],
  exports: [PrismaService],
})
export class PrismaModule {}
