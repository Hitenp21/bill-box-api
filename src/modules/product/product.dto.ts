import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'USB-C Charger' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 499.99 })
  @IsNumber()
  @Min(0)
  rate: number;

  @ApiPropertyOptional({
    example: 'High-quality USB-C charger with fast charging support',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'USB-C Charger Pro' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 599.99 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  rate?: number;

  @ApiPropertyOptional({
    example: 'High-quality USB-C charger with fast charging support',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class FindAllProductQueryDto {
  @ApiPropertyOptional({
    example: 'charger',
    description: 'Search products by name',
  })
  @IsString()
  @IsOptional()
  search?: string;
}

