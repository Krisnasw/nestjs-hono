import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/shared/database/database.service';
import { socialAccounts } from '@/shared/database/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class SocialAccountRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async findByProvider(provider: string, providerId: string) {
    const result = await this.dbService.db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.provider, provider as any),
          eq(socialAccounts.providerId, providerId),
        ),
      )
      .limit(1);
    return result[0];
  }

  async create(data: {
    userId: string;
    provider: string;
    providerId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  }) {
    const result = await this.dbService.db
      .insert(socialAccounts)
      .values(data as any)
      .returning();
    return result[0];
  }

  async update(
    id: string,
    data: {
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: Date;
    },
  ) {
    const result = await this.dbService.db
      .update(socialAccounts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(socialAccounts.id, id))
      .returning();
    return result[0];
  }
}
