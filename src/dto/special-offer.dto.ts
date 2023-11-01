import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsPositive,
  IsString,
  Min,
  Max,
} from "class-validator";

export class SpecialOfferDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(100)
  fixedPercentageDiscount: number;
}
