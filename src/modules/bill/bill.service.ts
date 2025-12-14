// src/bill/bill.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BillStatus, CreateBillDto, CustomFilterDto, FindAllBillQueryDto, UpdateBillDto } from './bill.dto';
import { TransactionClient } from 'generated/internal/prismaNamespace';

@Injectable()
export class BillService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBillDto) {
    return this.prisma.$transaction(async (tx: TransactionClient) => {
      // Get client to access userId
      const client = await tx.client.findUnique({
        where: { id: dto.clientId },
        select: { userId: true },
      });

      if (!client) throw new NotFoundException('Client not found');

      // If creating a sample bill, unset all other sample bills for this specific client
      if (dto.isSampleBill === true) {
        await tx.bill.updateMany({
          where: {
            isSampleBill: true,
            clientId: dto.clientId,
          },
          data: { isSampleBill: false },
        });
      }

      // Generate bill number if not provided
      let billNumber = dto.billNumber;
      if (!billNumber) {
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
        billNumber = `BILL-${timestamp}-${randomSuffix}`;
        
        // Ensure uniqueness by checking if it exists
        let exists = await tx.bill.findUnique({ where: { billNumber } });
        let attempts = 0;
        while (exists && attempts < 10) {
          const newRandomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
          billNumber = `BILL-${timestamp}-${newRandomSuffix}`;
          exists = await tx.bill.findUnique({ where: { billNumber } });
          attempts++;
        }
      }

      const bill = await tx.bill.create({
        data: {
          clientId: dto.clientId,
          billNumber: billNumber,
          total: dto.total,
          status: dto.status,
          notes: dto.notes,
          billDate: dto.billDate ? new Date(dto.billDate) : null,
          isSampleBill: dto.isSampleBill ?? false,
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

  async findAll(userId:string,customFilterDto?: CustomFilterDto, query?: FindAllBillQueryDto) {
    let { search , page, limit, status } = query || {};

    if(!page){
      page = 1;
    }
    if(!limit){
      limit = 10;
    }
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

    // Status filter
    if (status) {
      filters.status = status;
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

    const [bills, total ] = await Promise.all([
      this.prisma.bill.findMany({
      skip:(page - 1) * limit,
      take: limit,
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
    }),
      this.prisma.bill.count({
        where: {
          client:{
            userId,
          },
          ...filters,
          ...searchFilter,
        },
      })
    ]); 

    return {data: bills , total , totalPages: Math.ceil(total / limit)};
  }

  async findOne(userId: string, id: string) {
    const bill = await this.prisma.bill.findFirst({
      where: {
        id,
        client: {
          userId,
        },
      },
      include: {
        client: true,
        products: true,
      },
    });
    if (!bill) throw new NotFoundException('Bill not found');
    return bill;
  }

  async findByClientId(userId: string, clientId: string) {
    return this.prisma.bill.findMany({
      where: {
        clientId,
        client: {
          userId,
        },
      },
      include: {
        client: true,
        products: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(userId: string, id: string, dto: UpdateBillDto) {
    // exclude products from the data passed to Prisma's update because
    // products require nested create/update on the billProduct model.
    const { billDate, products, isSampleBill, ...otherData } = dto;
    return this.prisma.$transaction(async (tx: TransactionClient) => {
      // ensure bill exists & belongs to user
      const bill = await tx.bill.findFirst({
        where: { id, client: { userId } },
      });

      if (!bill) throw new NotFoundException('Bill not found');

      // If setting this bill as sample, unset all other sample bills for this specific client
      if (isSampleBill === true) {
        await tx.bill.updateMany({
          where: {
            isSampleBill: true,
            clientId: bill.clientId,
            id: { not: id }, // Exclude current bill
          },
          data: { isSampleBill: false },
        });
      }

      // update bill fields
      const updatedBill = await tx.bill.update({
        where: { id },
        data: {
          ...otherData,
          billDate: billDate ? new Date(billDate) : undefined,
          isSampleBill: isSampleBill !== undefined ? isSampleBill : undefined,
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

      // return updated bill with all relations
      return tx.bill.findUnique({
        where: { id },
        include: {
          client: true,
          products: true,
        },
      });
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
        status: BillStatus.PAID,
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
        status: BillStatus.UNPAID,
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
        status: BillStatus.PAID,
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
        status: BillStatus.UNPAID,
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


  async remove(id: string) {
    return this.prisma.bill.delete({ where: { id } });
  }

  async findSampleBills(userId: string) {
    return this.prisma.bill.findMany({
      where: {
        isSampleBill: true,
        client: {
          userId,
        },
      },
      include: {
        client: true,
        products: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findSampleBillByClient(userId: string, clientId: string) {
    const sampleBill = await this.prisma.bill.findFirst({
      where: {
        isSampleBill: true,
        clientId,
        client: {
          userId,
        },
      },
      include: {
        client: true,
        products: true,
      },
    });
    return sampleBill || null;
  }
}
