import { swaggerUI } from '@hono/swagger-ui';
import { HonoAdapter } from '@kiyasov/platform-hono';
import * as fs from 'fs';
import * as path from 'path';

export function setupHonoSwagger(adapter: HonoAdapter) {
  const app = adapter.getInstance();

  // Serve Swagger spec JSON
  app.get('/swagger/spec.json', (c: any) => {
    try {
      const specPath = path.join(process.cwd(), 'swagger-spec.json');
      if (fs.existsSync(specPath)) {
        const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
        return c.json(spec);
      }
      return c.json({ message: 'Swagger spec not found' }, 404);
    } catch {
      return c.json({ error: 'Failed to load swagger spec' }, 500);
    }
  });

  // Serve Swagger UI
  app.get(
    '/swagger',
    swaggerUI({
      url: '/swagger/spec.json',
    }),
  );

  console.log('Swagger UI available at /swagger');
}
