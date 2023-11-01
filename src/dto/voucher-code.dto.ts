import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class VerifyOrRedeemDTO {
  @ApiProperty()
  @IsString()
  uniqueCode: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  customerId: number;
}

export class VoucherCodeDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  uniqueCode?: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  expirationDate: Date;

  @ApiProperty({ default: false })
  @IsBoolean()
  isSingleUse: boolean;

  @ApiProperty()
  @IsNumber()
  customerId: number;

  @ApiProperty()
  @IsNumber()
  specialOfferId: number;
}

export class VoucherCodeBulkCreateDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  uniqueCode?: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  expirationDate: Date;

  @ApiProperty({ default: false })
  @IsBoolean()
  isSingleUse: boolean;

  @ApiProperty()
  @IsNumber()
  specialOfferId: number;
}

export class VoucherUsageDTO {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  usageDate: Date;

  @ApiProperty()
  @IsNumber()
  voucherCodeId: number;
}
