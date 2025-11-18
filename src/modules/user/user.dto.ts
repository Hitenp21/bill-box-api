import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Unique email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd', description: 'Password for user account' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '+919876543210', description: 'Phone number of the user' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['CLIENT', 'BILL'],
    description: 'Array of user permissions',
  })
  @IsOptional()
  @IsArray()
  permissions?: string[];
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Unique email address of the user' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: '+919876543210', description: 'Phone number of the user' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}



