import { SpecialOffer } from "@prisma/client";
import { SpecialOfferDTO } from "src/dto/special-offer.dto";

export const transformSpecialOfferToSpecialOfferDTO = (
  specialOffer: SpecialOffer
): SpecialOfferDTO => {
  const specialOfferDto = Object.assign(new SpecialOfferDTO(), {
    ...specialOffer,
  });
  return specialOfferDto;
};
