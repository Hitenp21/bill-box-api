import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './modules/client/client.module';
import { BillModule } from './modules/bill/bill.module';
import { PrismaService } from './prisma/prisma.service';
import { BillService } from './modules/bill/bill.service';
import { ClientService } from './modules/client/client.service';
import { UserModule } from './modules/user/user.module';
import { UserService } from './modules/user/user.service';
import { AuthModule } from './modules/auth/auth.module';
import { configuration } from './config';
import { DashboardService } from './modules/dashboard/dashboard.service';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { BillProductModule } from './modules/bill-product/bill-product.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration global
      load: [configuration], // Load the environment variables from the configuration file
    }),
    ClientModule,
    BillModule,
    UserModule,
    AuthModule,
    DashboardModule,
    BillProductModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, BillService, ClientService,UserService, PrismaService, DashboardService],
})
export class AppModule {}
