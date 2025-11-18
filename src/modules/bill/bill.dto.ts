import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsUUID,
  ValidateNested,
  IsArray,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Bill, BillStatus } from 'src/entity/bill.entity';
import { Type } from 'class-transformer';

// ---------------- BILL PRODUCT DTO ----------------
export class BillProductItemDto {
  @ApiProperty({
    example: 'USB-C Charger',
    description: 'Product name snapshot',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product',
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: 499.99,
    description: 'Rate snapshot at billing time',
  })
  @IsNumber()
  rate: number;
}

// ---------------- CREATE BILL DTO ----------------
export class CreateBillDto {
  @ApiProperty({ example: 'uuid-of-client' })
  @IsUUID()
  clientId: string;

  @ApiProperty({ example: 'INV-2025-001' })
  @IsString()
  billNumber: string;

  @ApiProperty({ example: 4500.75 })
  @IsNumber()
  total: number;

  @ApiPropertyOptional({ enum: BillStatus })
  @IsEnum(BillStatus)
  @IsOptional()
  status?: BillStatus;

  @ApiPropertyOptional({ example: '2025-11-10' })
  @IsDateString()
  @IsOptional()
  billDate?: string;

  @ApiPropertyOptional({ example: 'Payment due in 15 days' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    type: [BillProductItemDto],
    description: 'Bill product list',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillProductItemDto)
  products: BillProductItemDto[];
}

// ---------------- UPDATE BILL DTO ----------------
export class UpdateBillDto {
  @ApiPropertyOptional({ example: 'uuid-of-client' })
  @IsUUID()
  @IsOptional()
  clientId: string;

  @ApiProperty({ example: 4500.75 })
  @IsNumber()
  total: number;

  @ApiPropertyOptional({ enum: BillStatus })
  @IsEnum(BillStatus)
  @IsOptional()
  status?: BillStatus;

  @ApiPropertyOptional({ example: '2025-11-10' })
  @IsDateString()
  @IsOptional()
  billDate?: string;

  @ApiPropertyOptional({ example: 'Payment due in 15 days' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    type: [BillProductItemDto],
    description: 'Bill product list',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillProductItemDto)
  @IsOptional()
  products: BillProductItemDto[];
}

// Custom filter DTO for pagination/filtering
export class CustomFilterDto {
  @ApiPropertyOptional({
    example: '2025-01-01',
    description: 'Filter bills from this date (inclusive)',
  })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description: 'Filter bills up to this date (inclusive)',
  })
  @IsDateString()
  @IsOptional()
  toDate?: string;
}


export class FindAllBillQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Search by client name or bill number',
  })
  @IsString()
  @IsOptional()
  search?: string;
}

export class FindAllBillResultDto {
  @ApiProperty({
    description: 'Total number of bills matching the criteria',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'List of bills for the current page',
    type: [CreateBillDto],
  })
  data: Bill[];

  @ApiProperty({
    description: 'Total number of pages available',
    example: 50,
  })
  taotalPages: number;
}
