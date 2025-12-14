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
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, FindAllProductQueryDto } from './product.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Product } from 'src/entity/product.entity';
import { JwtUserAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'src/entity/user.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtUserAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  create(@GetUser() user: User, @Body() dto: CreateProductDto) {
    return this.productService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all products with optional search' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filter products by name',
  })
  @ApiResponse({ status: 200, description: 'List of products', type: [Product] })
  findAll(@GetUser() user: User, @Query() query?: FindAllProductQueryDto) {
    return this.productService.findAll(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a product by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found successfully',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.productService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  update(@GetUser() user: User, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.productService.remove(user.id, id);
  }
}

