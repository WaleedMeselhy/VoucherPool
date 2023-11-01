import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsNumber } from "class-validator";

export class CustomerDTO {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
