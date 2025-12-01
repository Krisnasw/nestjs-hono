import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: postgres.Sql;
  public db: PostgresJsDatabase<typeof schema>;

  async onModuleInit() {
    // Handle both ESM and CommonJS imports
    const postgresClient =
      typeof postgres === 'function' ? postgres : (postgres as any).default;

    // Use connection object instead of URL to handle empty password
    const connectionConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE_NAME || 'boilerplate',
    };

    this.client = postgresClient(connectionConfig);
    this.db = drizzle(this.client, { schema });
  }

  private buildDatabaseUrl(): string {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '5432';
    const username = process.env.DB_USERNAME || 'postgres';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_DATABASE_NAME || 'boilerplate';

    return `postgres://${username}:${password}@${host}:${port}/${database}`;
  }

  async onModuleDestroy() {
    await this.client?.end();
  }
}
