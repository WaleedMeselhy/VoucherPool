import { Injectable } from "@nestjs/common";
import { Customer } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CustomerDTO } from "src/dto/customer.dto";
import { DuplicatedCustomerEmail } from "src/errors/generic-error.error";

@Injectable()
export class CustomerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(): Promise<Customer[]> {
    return await this.prismaService.customer.findMany();
  }

  async findCustomerById(customerId: number): Promise<Customer> {
    return await this.prismaService.customer.findFirstOrThrow({
      where: {
        id: customerId,
      },
    });
  }

  async create(
    customerInfo: CustomerDTO,
    manager?: PrismaService
  ): Promise<Customer> {
    manager = manager || this.prismaService;
    try {
      return await manager.customer.create({
        data: {
          email: customerInfo.email,
          name: customerInfo.name,
        },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new DuplicatedCustomerEmail();
      }
    }
  }

  async listCustomerIds(manager?: PrismaService): Promise<number[]> {
    manager = manager || this.prismaService;
    const customers = await manager.customer.findMany({
      select: {
        id: true,
      },
    });
    return customers.map((customer) => customer.id);
  }
}
