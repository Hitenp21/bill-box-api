import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBillProductDto {

  @ApiProperty({
    example: 'USB-C Charger',
    description: 'Name of the product at billing time',
  })
  name: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product billed',
  })
  quantity: number;

  @ApiProperty({
    example: 499.99,
    description: 'Rate at the time of billing',
  })
  rate: number;
}

export class UpdateBillProductDto extends PartialType(CreateBillProductDto) {}