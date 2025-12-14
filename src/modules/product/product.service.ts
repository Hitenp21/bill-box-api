import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, FindAllProductQueryDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        userId,
        name: dto.name,
        rate: dto.rate,
        description: dto.description,
      },
    });
  }

  async findAll(userId: string, query?: FindAllProductQueryDto) {
    const { search } = query || {};
    
    return this.prisma.product.findMany({
      where: {
        userId,
        ...(search
          ? {
              name: { contains: search, mode: 'insensitive' },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, userId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(userId: string, id: string, dto: UpdateProductDto) {
    // Ensure product exists & belongs to user
    const product = await this.prisma.product.findFirst({
      where: { id, userId },
    });

    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    // Ensure product exists & belongs to user
    const product = await this.prisma.product.findFirst({
      where: { id, userId },
    });

    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.delete({ where: { id } });
  }
}


