import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Global } from "@nestjs/common";
import { PrismaClient } from "generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Global()
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    // Create a PostgreSQL connection pool
    const pool = new Pool({ connectionString });

    // Create the Prisma adapter
    const adapter = new PrismaPg(pool);

    // Call super with the adapter (must be first)
    super({ adapter });

    // Store pool reference after super call
    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error(
        `❌ Failed to connect to database: ${error.message}`,
      );
      this.logger.warn(
        '⚠️  Application started, but database operations will fail.',
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      await this.pool.end();
      this.logger.log('Database disconnected');
    } catch (error) {
      this.logger.error(`Error disconnecting from database: ${error.message}`);
    }
  }
}