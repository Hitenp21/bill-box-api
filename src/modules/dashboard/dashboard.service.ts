import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ClientService } from '../client/client.service';
import { BillService } from '../bill/bill.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService, private readonly userService:UserService, private readonly clientService:ClientService, private readonly billService:BillService) {}

    
  async userDashboard(userId:string) {

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const totalClients = await this.clientService.usersTotalClient(userId);

    const taotalBills = await this.billService.usersTotalBils(userId);

    const {earnings , debts} = await this.billService.getFinance(userId);

    // const {earnings:monthErning , debts:monthDebt} = await this.billService.getFinance(userId);

    return {
      totalClients,
      taotalBills,
      earnings,
      debts,
    };
  }

  async userMonthlyDashboard(userId:string) {

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const {earnings:monthErning , debts:monthDebt} = await this.billService.getFinance(userId,startOfMonth,endOfMonth);

    return {
      monthErning,
      monthDebt
    };
  }
}
