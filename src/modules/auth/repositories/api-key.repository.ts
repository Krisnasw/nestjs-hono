import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/shared/database/database.service';
import { apiKeys } from '@/shared/database/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class ApiKeyRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async findByKey(key: string) {
    const result = await this.dbService.db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.key, key), eq(apiKeys.isActive, true)))
      .limit(1);
    return result[0];
  }

  async create(data: {
    userId: string;
    key: string;
    name: string;
    expiresAt?: Date;
  }) {
    const result = await this.dbService.db.insert(apiKeys).values(data).returning();
    return result[0];
  }

  async updateLastUsed(id: string) {
    await this.dbService.db
      .update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, id));
  }

  async findByUserId(userId: string) {
    return this.dbService.db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId));
  }

  async revoke(id: string) {
    const result = await this.dbService.db
      .update(apiKeys)
      .set({ isActive: false })
      .where(eq(apiKeys.id, id))
      .returning();
    return result[0];
  }
}
