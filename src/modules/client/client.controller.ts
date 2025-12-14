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
import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './client.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Client } from 'src/entity/client.entity';
import { JwtUserAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { BillService } from '../bill/bill.service';
import { Bill } from 'src/entity/bill.entity';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtUserAuthGuard)
@Controller('clients')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly billService: BillService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully',
    type: Client,
  })
  create(@GetUser() user:User, @Body() dto: CreateClientDto) {
    return this.clientService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all clients with optional search' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filter clients by name or email',
  })
  @ApiResponse({ status: 200, description: 'List of clients', type: [Client] })
  findAll(@GetUser() user:User,@Query('search') search?: string) {
    return this.clientService.findAll(user.id,search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single client by ID' })
  @ApiResponse({ status: 200, description: 'Client found', type: Client })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findOne(@GetUser() user:User,@Param('id') id: string) {
    return this.clientService.findOne(user.id,id);
  }

  @Get(':id/bills')
  @ApiOperation({ summary: 'Get all bills for a specific client' })
  @ApiResponse({ status: 200, description: 'List of bills for the client', type: [Bill] })
  @ApiResponse({ status: 404, description: 'Client not found' })
  getClientBills(@GetUser() user: User, @Param('id') clientId: string) {
    return this.billService.findByClientId(user.id, clientId);
  }

  @Get(':id/sample-bill')
  @ApiOperation({ 
    summary: 'Get the sample bill for a specific client',
    description: 'Returns the sample bill for the client (only one sample bill exists per client). Returns null if no sample bill exists.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sample bill for the client (or null if not found)', 
    type: Bill 
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  getClientSampleBill(@GetUser() user: User, @Param('id') clientId: string) {
    return this.billService.findSampleBillByClient(user.id, clientId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client by ID' })
  @ApiResponse({
    status: 200,
    description: 'Client updated successfully',
    type: Client,
  })
  update(@GetUser() user:User,@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientService.update(user.id,id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client by ID' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully' })
  remove(@GetUser() user:User,@Param('id') id: string) {
    return this.clientService.remove(user.id,id);
  }
}
