import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBillProductDto , UpdateBillProductDto} from './bill-product.dto';

@Injectable()
export class BillProductService {
  constructor(private prisma: PrismaService) {}

  async create(billId:string,dto: CreateBillProductDto) {
    return this.prisma.billProduct.create({
      data: {billId, ...dto},
    });
  }

  async findAll(billId:string) {
    return this.prisma.billProduct.findMany({
      where:{billId},
      include: { bill: true },
    });
  }

  async findOne(billId:string,id: string) {
    const item = await this.prisma.billProduct.findUnique({
      where: { id , billId},
      include: { bill: true },
    });

    if (!item) throw new NotFoundException('Bill product not found');

    return item;
  }

  async update(billId:string ,id: string, dto: UpdateBillProductDto) {
    return this.prisma.billProduct.update({
      where: { id , billId },
      data: dto,
    });
  }

  async remove(billId : string, id: string) {
    return this.prisma.billProduct.delete({
      where: { id , billId },
    });
  }
}
