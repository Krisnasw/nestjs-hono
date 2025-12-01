import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

const buildConnectionUrl = () => {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const user = process.env.DB_USERNAME || 'postgres';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_DATABASE_NAME || 'boilerplate';

  // If password is empty, omit it from URL
  if (password) {
    return `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }
  return `postgresql://${user}@${host}:${port}/${database}`;
};

export default defineConfig({
  schema: './src/shared/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: buildConnectionUrl(),
  },
});
