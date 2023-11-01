import { Injectable } from "@nestjs/common";
import { VoucherCode, VoucherUsage } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { VoucherCodeDTO } from "src/dto/voucher-code.dto";

@Injectable()
export class VoucherCodeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(): Promise<VoucherCode[]> {
    return await this.prismaService.voucherCode.findMany();
  }

  async updateUsage(
    voucherCodeId: number,
    usageDate: Date,
    manager: PrismaService
  ) {
    const voucherCodes = await manager.voucherCode.updateMany({
      data: {
        firstDateOfUsage: usageDate,
      },
      where: {
        id: voucherCodeId,
        firstDateOfUsage: null,
      },
    });
    return voucherCodes;
  }

  async verify(voucherCode: string, customerId: number): Promise<VoucherCode> {
    return await this.prismaService.voucherCode.findUniqueOrThrow({
      where: {
        uniqueCode: voucherCode,
        customerId: customerId,
      },
    });
  }

  async create(
    customerInfo: VoucherCodeDTO,
    manager?: PrismaService
  ): Promise<VoucherCode> {
    manager = manager || this.prismaService;
    return manager.voucherCode.create({
      data: {
        expirationDate: customerInfo.expirationDate,
        isSingleUse: customerInfo.isSingleUse,
        uniqueCode: customerInfo.uniqueCode,
        customerId: customerInfo.customerId,
        specialOfferId: customerInfo.specialOfferId,
      },
    });
  }

  async createUsage(
    voucherId: number,
    usageDate: Date,
    manager?: PrismaService
  ): Promise<VoucherUsage> {
    manager = manager || this.prismaService;
    return await manager.voucherUsage.create({
      data: {
        voucherCodeId: voucherId,
        usageDate: usageDate,
      },
    });
  }
}
