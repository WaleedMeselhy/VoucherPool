import { Injectable } from "@nestjs/common";
import { Logger } from "../lib/Logger/log4j.lib.logger";
import { CustomerRepository } from "../repositories/customer.repository";
import { CustomerDTO } from "src/dto/customer.dto";
import { transformCustomerToCustomerDTO } from "src/transformers/CustomerToCustomerDTO.transformer";

@Injectable()
export class CustomerService {
  constructor(
    private readonly logger: Logger,
    private readonly customerRepository: CustomerRepository
  ) {}

  async list(): Promise<CustomerDTO[]> {
    const customers = await this.customerRepository.list();
    return customers.map((customer) =>
      transformCustomerToCustomerDTO(customer)
    );
  }

  async create(customerInfo: CustomerDTO): Promise<CustomerDTO> {
    const customer = await this.customerRepository.create(customerInfo);
    return transformCustomerToCustomerDTO(customer);
  }
}
