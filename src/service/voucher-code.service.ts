import { Injectable } from "@nestjs/common";
import { Logger } from "../lib/Logger/log4j.lib.logger";
import {
VerifyOrRedeemDTO,
  VoucherCodeBulkCreateDTO,
  VoucherCodeDTO,
VoucherUsageDTO,
} from "src/dto/voucher-code.dto";
import { VoucherCodeRepository } from "src/repositories/voucher-code.repository";
import { nanoid } from "nanoid";
import { transformVoucherCodeToVoucherCodeDTO } from "src/transformers/VoucherCodeToVoucherCodeDTO.transformer";
import { CustomerRepository } from "src/repositories/customer.repository";
import { PrismaService } from "src/prisma/prisma.service";
import { VoucherAlreadyUsed } from "src/errors/generic-error.error";

@Injectable()
export class VoucherCodeService {
  constructor(
    private readonly logger: Logger,
    private readonly voucherCodeRepository: VoucherCodeRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly prismaService: PrismaService
  ) {}

  async list(): Promise<VoucherCodeDTO[]> {
    const voucherCodes = await this.voucherCodeRepository.list();
    return voucherCodes.map((voucherCode) =>
      transformVoucherCodeToVoucherCodeDTO(voucherCode)
    );
  }

  async redeem(redeemParams: VerifyOrRedeemDTO): Promise<VoucherUsageDTO> {
    const voucherUsage = await this.prismaService.$transaction(
      async (manager: PrismaService) => {
        const voucherCode = await this.voucherCodeRepository.verify(
          redeemParams.uniqueCode,
          redeemParams.customerId
        );
        const usageDate = new Date();
        if (!voucherCode.isSingleUse) {
          const voucherUsage = await this.voucherCodeRepository.createUsage(
            voucherCode.id,
            usageDate,
            manager
          );
          await this.voucherCodeRepository.updateUsage(
            voucherCode.id,
            usageDate,
            manager
          );
          return voucherUsage;
        } else {
          const voucherUsage = await this.voucherCodeRepository.createUsage(
            voucherCode.id,
            usageDate,
            manager
          );
          const voucherCodeUpdateResult =
            await this.voucherCodeRepository.updateUsage(
              voucherCode.id,
              usageDate,
              manager
            );
          if (voucherCodeUpdateResult.count === 1) {
            return voucherUsage;
          } else {
            // voucher code has been used
            throw new VoucherAlreadyUsed();
          }
        }
      }
    );
    return voucherUsage;
  }

  async verify(verifyParams: VerifyOrRedeemDTO): Promise<VoucherCodeDTO> {
    const voucherCode = await this.voucherCodeRepository.verify(
      verifyParams.uniqueCode,
      verifyParams.customerId
    );
    return transformVoucherCodeToVoucherCodeDTO(voucherCode);
  }

  async create(voucherCodeInfo: VoucherCodeDTO): Promise<VoucherCodeDTO> {
    const uniqueCode = nanoid(10);
    voucherCodeInfo.uniqueCode = uniqueCode;
    voucherCodeInfo.expirationDate = new Date(voucherCodeInfo.expirationDate);
    const voucherCode = await this.voucherCodeRepository.create(
      voucherCodeInfo
    );
    return transformVoucherCodeToVoucherCodeDTO(voucherCode);
  }

  async bulkCreate(
    voucherCodeBulkCreateDTO: VoucherCodeBulkCreateDTO
  ): Promise<VoucherCodeDTO[]> {
    const customersIds = await this.customerRepository.listCustomerIds();
    voucherCodeBulkCreateDTO.expirationDate = new Date(
      voucherCodeBulkCreateDTO.expirationDate
    );
    return await this.prismaService.$transaction(
      async (manager: PrismaService) => {
        const voucherCodes = [];
        for (const customerId of customersIds) {
          const uniqueCode = nanoid(10);
          voucherCodeBulkCreateDTO.uniqueCode = uniqueCode;
          const voucherCodeDTO = Object.assign(
            {
              ...voucherCodeBulkCreateDTO,
              customerId: customerId,
            },
            voucherCodeBulkCreateDTO
          );
          const voucherCode = await this.voucherCodeRepository.create(
            voucherCodeDTO,
            manager
          );
          voucherCodes.push(transformVoucherCodeToVoucherCodeDTO(voucherCode));
        }
        return voucherCodes;
      }
    );
  }
}
