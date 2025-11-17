import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BillController],
  providers: [BillService, PrismaService],
  exports: [BillService],
})
export class BillModule {}
