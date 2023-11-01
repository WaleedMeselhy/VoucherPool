import { Injectable } from "@nestjs/common";
import { Logger } from "../lib/Logger/log4j.lib.logger";
import { SpecialOfferDTO } from "src/dto/special-offer.dto";
import { SpecialOfferRepository } from "src/repositories/special-offer.repository";
import { transformSpecialOfferToSpecialOfferDTO } from "src/transformers/SpecialOfferToSpecialOfferDTO.transformer";

@Injectable()
export class SpecialOfferService {
  constructor(
    private readonly logger: Logger,
    private readonly specialOfferRepository: SpecialOfferRepository
  ) {}

  async list(): Promise<SpecialOfferDTO[]> {
    const specialOffers = await this.specialOfferRepository.list();
    return specialOffers.map((specialOffer) =>
      transformSpecialOfferToSpecialOfferDTO(specialOffer)
    );
  }

  async create(specialOfferInfo: SpecialOfferDTO): Promise<SpecialOfferDTO> {
    const specialOffer = await this.specialOfferRepository.create(
      specialOfferInfo
    );
    return transformSpecialOfferToSpecialOfferDTO(specialOffer);
  }
}
