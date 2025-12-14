import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Product {
  @ApiProperty({
    example: 'prod_12345',
    description: 'Unique ID of the product',
  })
  id: string;

  @ApiProperty({
    example: 'USB-C Charger',
    description: 'Name of the product',
  })
  name: string;

  @ApiProperty({
    example: 499.99,
    description: 'Rate/price of the product',
  })
  rate: number;

  @ApiPropertyOptional({
    example: 'High-quality USB-C charger with fast charging support',
    description: 'Product description',
  })
  description?: string;

  @ApiProperty({
    example: 'user_12345',
    description: 'ID of the user who owns this product',
  })
  userId: string;

  @ApiProperty({
    example: '2025-01-15T10:30:00Z',
    description: 'Product creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-15T10:30:00Z',
    description: 'Product last update timestamp',
  })
  updatedAt: Date;
}

