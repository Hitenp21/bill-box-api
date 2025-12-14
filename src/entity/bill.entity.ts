import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Client } from './client.entity';

export enum BillStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export class Bill {
  @ApiProperty({ example: 'bill_001', description: 'Unique bill ID' })
  id: string;

  @ApiProperty({ example: 'INV-2025-001', description: 'Unique bill number' })
  billNumber: string;

  @ApiProperty({ example: 'clt_12345', description: 'Associated client ID' })
  clientId: string;

  @ApiPropertyOptional({
    type: () => Client,
    description: 'Client details for this bill',
  })
  client?: Client;

  @ApiProperty({ example: 2500.75, description: 'Total bill amount' })
  total: number;

  @ApiProperty({
    enum: BillStatus,
    example: BillStatus.PAID,
    description: 'Current bill status',
  })
  status: BillStatus;

  @ApiPropertyOptional({
    example: '2025-11-10',
    description: 'Date when the bill was issued',
  })
  billDate?: Date;

  @ApiPropertyOptional({
    example: 'Payment received on time',
    description: 'Additional notes for the bill',
  })
  notes?: string;

  @ApiProperty({
    example: false,
    description: 'Flag indicating if this is a sample bill',
    default: false,
  })
  isSampleBill: boolean;

  @ApiProperty({ example: '2025-11-10T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-11-11T12:00:00Z' })
  updatedAt: Date;
}
