import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from 'src/entity/user.entity';
import { JwtUserAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';


@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtUserAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get("me")
  @ApiOperation({ summary: 'Retrieve a single user by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  loginUser(@GetUser() user: User) {
    return this.userService.findOne(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users with optional search' })
  @ApiQuery({ name: 'search', required: false, description: 'Filter users by name or email' })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  findAll(@Query('search') search?: string) {
    return this.userService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single user by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user details by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
