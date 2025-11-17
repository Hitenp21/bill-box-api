import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Bill } from './bill.entity';

export class BillProduct {
  @ApiProperty({
    example: 'blp_12345',
    description: 'Unique ID of the bill product entry',
  })
  id: string;

  @ApiProperty({
    example: 'bill_67890',
    description: 'ID of the associated bill',
  })
  billId: string;

  @ApiProperty({
    example: 'USB-C Charger',
    description: 'Name of the product at billing time (snapshot)',
  })
  name: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product billed',
  })
  quantity: number;

  @ApiProperty({
    example: 499.99,
    description: 'Rate at the time of billing (snapshot of product rate)',
  })
  rate: number;

  @ApiPropertyOptional({
    type: () => Bill,
    description: 'Associated bill details (optional relation)',
  })
  bill?: Bill;
}
