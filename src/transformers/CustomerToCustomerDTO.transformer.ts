import { Customer } from "@prisma/client";
import { CustomerDTO } from "../dto/customer.dto";

export const transformCustomerToCustomerDTO = (
  customer: Customer
): CustomerDTO => {
  const customerDto = Object.assign(new CustomerDTO(), {
    ...customer,
  });
  return customerDto;
};
