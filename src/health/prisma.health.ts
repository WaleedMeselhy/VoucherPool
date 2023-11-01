import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DBHealthIndicator extends HealthIndicator implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async onModuleInit(): Promise<void> {
    //
  }

  async onModuleDestroy(): Promise<void> {
    this.prismaService.$disconnect;
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      const result = this.getStatus('Database', true, {});
      return result;
    } catch (err) {
      console.log(err);
      const result = this.getStatus('Database', false, {});
      throw new HealthCheckError('Database', result);
    }
  }
}
