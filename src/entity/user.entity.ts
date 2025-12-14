import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER',
  SUPERADMIN = 'SUPERADMIN',
}

export class User {
  @ApiProperty({ example: 'usr_12345', description: 'Unique user ID' })
  id: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'hashed_password',
    description: 'Hashed password (hidden in responses)',
  })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name: string;

  @ApiPropertyOptional({
    example: 'Acme Corporation',
    description: 'Company name of the user',
  })
  companyName?: string;

  @ApiPropertyOptional({
    example: '+919876543210',
    description: 'User phone number',
  })
  phoneNumber?: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'User role in the system',
  })
  role: UserRole;

  @ApiProperty({
    type: [String],
    example: ['CREATE_CLIENT', 'VIEW_BILL'],
    description: 'List of permission strings for the user',
  })
  permissions: string[];

  @ApiPropertyOptional({
    example: 'true',
    description: 'User active status',
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'false',
    description: 'User email verification status',
  })
  isEmailVerified?: boolean;

  @ApiProperty({
    example: '2025-11-11T10:00:00Z',
    description: 'User creation timestamp',
  })
  @IsOptional()
  createdAt: Date;

  @ApiProperty({
    example: '2025-11-11T12:00:00Z',
    description: 'Last updated timestamp',
  })
  @IsOptional()
  updatedAt: Date;
}
