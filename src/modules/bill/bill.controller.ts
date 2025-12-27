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
import { CreateBillDto, CustomFilterDto, FindAllBillQueryDto, FindAllBillResultDto, UpdateBillDto } from './bill.dto';
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
  @ApiOperation({ 
    summary: 'Create a new bill',
    description: 'Create a new bill. If isSampleBill is set to true, any existing sample bill for that client will be automatically unset to ensure only one sample bill exists per client.'
  })
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
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PAID', 'UNPAID', 'OVERDUE', 'CANCELLED'],
    description: 'Filter bills by status',
  })
  @ApiBody({
    type: CustomFilterDto,
    description: 'Optional date filter for bills',
  })
  @ApiResponse({
    status: 200,
    description: 'List of bills matching filters',
    type: FindAllBillResultDto,
  })
  findAll(
    @GetUser() user:User,
    @Query() query?: FindAllBillQueryDto,
    @Body() customFilterDto?: CustomFilterDto,
  ) {
    return this.billService.findAll(user.id,customFilterDto, query);
  }

  @Post('client/:clientId/bills')
  @ApiOperation({
    summary: 'Retrieve paginated bills with optional filters and search',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search bills by client name or bill number',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PAID', 'UNPAID', 'OVERDUE', 'CANCELLED'],
    description: 'Filter bills by status',
  })
  @ApiBody({
    type: CustomFilterDto,
    description: 'Optional date filter for bills',
  })
  @ApiResponse({
    status: 200,
    description: 'List of bills matching filters',
    type: FindAllBillResultDto,
  })
  findAllClientBills(
    @GetUser() user:User,
    @Param('clientId') clientId: string,
    @Query() query?: FindAllBillQueryDto,
    @Body() customFilterDto?: CustomFilterDto,
  ) {
    return this.billService.clientBills(user.id, clientId, customFilterDto, query);
  }

  @Get('samples')
  @ApiOperation({ 
    summary: 'Retrieve all sample bills for the authenticated user',
    description: 'Returns all sample bills for the user (one per client). Returns empty array if no sample bills exist.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of sample bills (one per client)',
    type: [Bill],
  })
  findSampleBills(@GetUser() user: User) {
    return this.billService.findSampleBills(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a bill by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Bill found successfully',
    type: Bill,
  })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.billService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a bill by ID',
    description: 'Update a bill including sample bills. You can update all fields including isSampleBill flag. If setting isSampleBill to true, any existing sample bill for that client will be automatically unset to ensure only one sample bill exists per client.'
  })
  @ApiResponse({
    status: 200,
    description: 'Bill updated successfully',
    type: Bill,
  })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  update(@GetUser() user:User,@Param('id') id: string, @Body() dto: UpdateBillDto) {
    return this.billService.update(user.id,id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bill by ID' })
  @ApiResponse({ status: 200, description: 'Bill deleted successfully' })
  remove(@Param('id') id: string) {
    return this.billService.remove(id);
  }
}
