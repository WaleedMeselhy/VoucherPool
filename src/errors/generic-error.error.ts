import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class DuplicatedCustomerEmail extends BadRequestException {
  constructor(message?: string) {
    super(message ?? "Customer with this email already exists");
    this.name = "DuplicatedCustomerEmail";
  }
}

@Injectable()
export class VoucherAlreadyUsed extends BadRequestException {
  constructor(message?: string) {
    super(message ?? "Vocuher already used");
    this.name = "VoucherAlreadyUsed";
  }
}
