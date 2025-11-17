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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';
import { JwtUserAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { DashboardResDto, MonthlyDashboardResDto } from './dashboard.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';


@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtUserAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}


  @Get()
  @ApiOperation({ summary: 'Retrieve user dash bord detail' })
  @ApiQuery({ name: 'search', required: false, description: 'Filter users by name or email' })
  @ApiResponse({ status: 200, description: 'List of users', type: DashboardResDto })
  dashbord(@GetUser() user:User):Promise<DashboardResDto> {
    return this.dashboardService.userDashboard(user.id);
  }

  @Get("/monthly")
  @ApiOperation({ summary: 'Retrieve user dash bord detail' })
  @ApiQuery({ name: 'search', required: false, description: 'Filter users by name or email' })
  @ApiResponse({ status: 200, description: 'List of users', type: DashboardResDto })
  dashbordMothly(@GetUser() user:User):Promise<MonthlyDashboardResDto> {
    return this.dashboardService.userMonthlyDashboard(user.id);
  }

}
