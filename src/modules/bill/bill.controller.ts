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
import { BillService } from './bill.service';
import { CreateBillDto, CustomFilterDto, UpdateBillDto } from './bill.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Bill } from 'src/entity/bill.entity';
import { JwtUserAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'src/entity/user.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';

@ApiTags('Bills')
@ApiBearerAuth()
@UseGuards(JwtUserAuthGuard)
@Controller('bills')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bill' })
  @ApiResponse({
    status: 201,
    description: 'Bill created successfully',
    type: Bill,
  })
  create(@Body() dto: CreateBillDto) {
    return this.billService.create(dto);
  }

  @Post('/paginate')
  @ApiOperation({
    summary: 'Retrieve paginated bills with optional filters and search',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search bills by client name or bill number',
  })
  @ApiBody({
    type: CustomFilterDto,
    description: 'Optional date filter for bills',
  })
  @ApiResponse({
    status: 200,
    description: 'List of bills matching filters',
    type: [Bill],
  })
  findAll(
    @GetUser() user:User,
    @Query('search') search?: string,
    @Body() customFilterDto?: CustomFilterDto,
  ) {
    return this.billService.findAll(user.id,customFilterDto, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a bill by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Bill found successfully',
    type: Bill,
  })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  findOne(@Param("clientId") clientId:string,@Param('id') id: string) {
    return this.billService.findOne(clientId,id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bill by ID' })
  @ApiResponse({
    status: 200,
    description: 'Bill updated successfully',
    type: Bill,
  })
  update(@GetUser() user:User,@Param('id') id: string, @Body() dto: UpdateBillDto) {
    return this.billService.update(user.id,id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bill by ID' })
  @ApiResponse({ status: 200, description: 'Bill deleted successfully' })
  remove(@Param("clientId") clientId:string,@Param('id') id: string) {
    return this.billService.remove(clientId,id);
  }
}
