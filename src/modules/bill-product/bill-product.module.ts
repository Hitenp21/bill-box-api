import { Module } from '@nestjs/common';
import { BillProductController } from './bill-product.controller';
import { BillProductService } from './bill-product.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BillProductController],
  providers: [BillProductService, PrismaService]
})
export class BillProductModule {}
