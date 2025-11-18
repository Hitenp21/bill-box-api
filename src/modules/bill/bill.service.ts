// src/bill/bill.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBillDto, CustomFilterDto, UpdateBillDto } from './bill.dto';

@Injectable()
export class BillService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBillDto) {
    return this.prisma.$transaction(async (tx) => {
      const bill = await tx.bill.create({
        data: {
          clientId: dto.clientId,
          billNumber: dto.billNumber,
          total: dto.total,
          status: dto.status,
          notes: dto.notes,
          billDate: dto.billDate ? new Date(dto.billDate) : null,
        },
      });

      // create bill products
      await tx.billProduct.createMany({
        data: dto.products.map((p) => ({
          billId: bill.id,
          name: p.name,
          quantity: p.quantity,
          rate: p.rate,
        })),
      });

      return bill;
    });
  }

  async findAll(userId:string,customFilterDto?: CustomFilterDto, search?: string) {
    const filters: any = {};
    const { fromDate, toDate } = customFilterDto || {};

    // Date filter handling
    if (fromDate && toDate) {
      filters.billDate = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      };
    } else if (fromDate) {
      filters.billDate = { gte: new Date(fromDate) };
    } else if (toDate) {
      filters.billDate = { lte: new Date(toDate) };
    }

    // Search filter (by bill number or client name)
    const searchFilter = search
      ? {
          OR: [
            { billNumber: { contains: search, mode: 'insensitive' } },
            { client: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

    const bills = await this.prisma.bill.findMany({
      where: {
        client:{
          userId,
        },
        ...filters,
        ...searchFilter,
      },
      include: {
        client: true,
        products: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return bills;
  }

  async findOne(userId:string,id: string) {
    const bill = await this.prisma.bill.findUnique({
      where: { client:{
        userId,
      },id },
      include: { client: true },
    });
    if (!bill) throw new NotFoundException('Bill not found');
    return bill;
  }

  async update(userId: string, id: string, dto: UpdateBillDto) {
    // exclude products from the data passed to Prisma's update because
    // products require nested create/update on the billProduct model.
    const { billDate, products, ...otherData } = dto;
    return this.prisma.$transaction(async (tx) => {
      // ensure bill exists & belongs to user
      const bill = await tx.bill.findFirst({
        where: { id, client: { userId } },
      });

      if (!bill) throw new NotFoundException('Bill not found');

      // update bill fields
      const updatedBill = await tx.bill.update({
        where: { id },
        data: {
          ...otherData,
          billDate: billDate ? new Date(billDate) : undefined,
        },
      });

      // delete old bill products
      await tx.billProduct.deleteMany({ where: { billId: id } });

      // insert updated bill products
      if (dto.products?.length) {
        await tx.billProduct.createMany({
          data: dto.products.map((p) => ({
            billId: id,
            name: p.name,
            quantity: p.quantity,
            rate: p.rate,
          })),
        });
      }

      return updatedBill;
    });
  }

  async usersTotalBils(userId:string) {
    return  this.prisma.bill.count({
      where: { client: { userId } },
    });
  }

  async totalErningBills(userId:string){
    const totalEarnings = await this.prisma.bill.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: "PAID",
        client: { userId },
      },
    });

    return totalEarnings._sum.total || 0;
  }

  async totalDebtsBills(userId:string){
    const totalEarnings = await this.prisma.bill.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: "UNPAID",
        client: { userId },
      },
    });

    return totalEarnings._sum.total || 0;
  }

  async getFinance(userId:string,startDate?:Date,endDate?:Date) {

  // Run aggregates in parallel
  const [earnings, debts] = await Promise.all([
    // Total earnings (PAID)
    this.prisma.bill.aggregate({
      _sum: { total: true },
      where: {
        client: { userId },
        status: "PAID",
        ...(startDate && endDate
          ? {
              billDate: {
                gte: startDate,
                lte: endDate,
              },
            }
          : {}),
      },
    }),

    // Total debts (UNPAID + OVERDUE)
    this.prisma.bill.aggregate({
      _sum: { total: true },
      where: {
        client: { userId },
        status: "UNPAID",
        ...(startDate && endDate
          ? {
              billDate: {
                gte: startDate,
                lte: endDate,
              },
            }
          : {}),
      },
    }),
  ]);

  // Return results
  return {
    earnings: earnings._sum.total || 0,
    debts: debts._sum.total || 0,
  };
}


  async remove(clientId:string,id: string) {
    return this.prisma.bill.delete({ where: {clientId, id } });
  }
}
