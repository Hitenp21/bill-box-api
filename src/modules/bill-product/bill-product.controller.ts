import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { BillProductService } from './bill-product.service';
import { CreateBillProductDto, UpdateBillProductDto } from './bill-product.dto';

@ApiTags('Bill Products')
@Controller('/bills/:billId/bill-products')
export class BillProductController {
  constructor(private readonly billProductService: BillProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a bill product entry' })
  @ApiBody({ type: CreateBillProductDto })
  create(@Param("billId") billId:string , @Body() dto: CreateBillProductDto) {
    return this.billProductService.create(billId,dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bill products' })
  findAll(@Param("billId") billId:string) {
    return this.billProductService.findAll(billId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bill product by ID' })
  @ApiParam({ name: 'id', example: 'blp_12345' })
  findOne(@Param("billId") billId:string , @Param('id') id: string) {
    return this.billProductService.findOne(billId,id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bill product entry' })
  @ApiParam({ name: 'id', example: 'blp_12345' })
  update(@Param("billId") billId:string , @Param('id') id: string, @Body() dto: UpdateBillProductDto) {
    return this.billProductService.update(billId,id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bill product entry' })
  @ApiParam({ name: 'id', example: 'blp_12345' })
  remove(@Param("billId") billId:string , @Param('id') id: string) {
    return this.billProductService.remove(billId,id);
  }
}
