import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";


export class DashboardResDto {

  @ApiProperty({
    example: '24',
    description: 'Total clients',
  })
  @IsNumber()
  totalClients: number;

  @ApiProperty({
    example: '24',
    description: 'Total bills',
  })
  @IsNumber()
  taotalBills: number;

  @ApiProperty({
    example: '1200',
    description: 'Total erning amount',
  })
  @IsNumber()
  earnings: number;

  @ApiProperty({
    example: '1200',
    description: 'Total debts amount',
  })
  @IsNumber()
  debts: number;
}

export class MonthlyDashboardResDto {

  @ApiProperty({
    example: '24',
    description: 'Total month earnings',
  })
  @IsNumber()
  monthErning: number;

  @ApiProperty({
    example: '24',
    description: 'Total month debts',
  })
  @IsNumber()
  monthDebt: number;
}