import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/shared/database/database.service';
import { users } from '@/shared/database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async findByEmail(email: string) {
    const result = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0];
  }

  async findById(id: string) {
    const result = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async create(data: {
    email: string;
    name?: string;
    password?: string;
    avatar?: string;
    emailVerified?: boolean;
  }) {
    const result = await this.dbService.db.insert(users).values(data).returning();
    return result[0];
  }

  async update(id: string, data: Partial<typeof users.$inferInsert>) {
    const result = await this.dbService.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
}
