import { VoucherCode } from "@prisma/client";
import { VoucherCodeDTO } from "src/dto/voucher-code.dto";

export const transformVoucherCodeToVoucherCodeDTO = (
  voucherCode: VoucherCode
): VoucherCodeDTO => {
  const voucherCodeDto = Object.assign(new VoucherCodeDTO(), {
    ...voucherCode,
  });
  return voucherCodeDto;
};
