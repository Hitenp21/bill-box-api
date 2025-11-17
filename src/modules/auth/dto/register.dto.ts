import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Unique email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd', description: 'Password for user account' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name: string;

}