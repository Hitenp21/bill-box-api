import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Bill } from './bill.entity';

export class Client {
  @ApiProperty({ example: 'clt_12345', description: 'Unique client ID' })
  id: string;

  @ApiProperty({
    example: 'client@example.com',
    description: 'Client email address',
  })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Client name' })
  name: string;

  @ApiPropertyOptional({
    example: '+919876543210',
    description: 'User phone number',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    type: () => [Bill],
    description: 'List of bills associated with the client',
  })
  bills?: Bill[];

  @ApiProperty({
    example: '2025-11-11T10:00:00Z',
    description: 'Client creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-11-11T10:00:00Z',
    description: 'Last updated timestamp',
  })
  updatedAt: Date;
}
