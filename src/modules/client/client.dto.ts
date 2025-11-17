import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// CreateClientDto with validation decorators
export class CreateClientDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The unique email address of the client',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the client',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: '+919876543210',
    description: 'Client phone number',
  })
  @IsString()
  phoneNumber?: string;
}

// UpdateClientDto extends PartialType of CreateClientDto
export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiPropertyOptional({
    example: 'updated.email@example.com',
    description: 'Optional updated email address',
  })
  email?: string;

  @ApiPropertyOptional({
    example: 'John Updated',
    description: 'Optional updated client name',
  })
  name?: string;

  @ApiPropertyOptional({
    example: '+919876543210',
    description: 'User phone number',
  })
  phoneNumber?: string;
}
