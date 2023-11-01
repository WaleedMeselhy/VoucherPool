import { Injectable } from "@nestjs/common";
import { SpecialOffer } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { SpecialOfferDTO } from "src/dto/special-offer.dto";

@Injectable()
export class SpecialOfferRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(): Promise<SpecialOffer[]> {
    return await this.prismaService.specialOffer.findMany();
  }

  async create(
    customerInfo: SpecialOfferDTO,
    manager?: PrismaService
  ): Promise<SpecialOffer> {
    manager = manager || this.prismaService;
    return manager.specialOffer.create({
      data: {
        fixedPercentageDiscount: customerInfo.fixedPercentageDiscount,
        name: customerInfo.name,
      },
    });
  }
}
