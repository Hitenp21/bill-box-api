// src/client/client.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './client.dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createClientDto: CreateClientDto) {
    return this.prisma.client.create({
      data: { userId, ...createClientDto },
    });
  }

  async findAll(userId: string, search?: string) {
    return this.prisma.client.findMany({
      where: {
        userId,
        ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
            userId,
          }
          : {}),
      },
      
      include: { bills: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const client = await this.prisma.client.findUnique({
      where: { userId, id },
      include: { bills: true },
    });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async usersTotalClient(userId:string) {
    return  this.prisma.client.count({
      where: { userId },
    });
  }

  async update(userId:string,id: string, updateClientDto: UpdateClientDto) {
    return this.prisma.client.update({
      where: { id, userId },
      data: updateClientDto,
    });
  }

  async remove(userId:string,id: string) {
    return this.prisma.client.delete({ where: { userId,id } });
  }
}
