import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

@ApiExcludeController()
@Controller('swagger')
export class SwaggerController {
  @Get('spec.json')
  getSwaggerSpec() {
    try {
      const specPath = path.join(process.cwd(), 'swagger-spec.json');
      if (fs.existsSync(specPath)) {
        const spec = fs.readFileSync(specPath, 'utf-8');
        return JSON.parse(spec);
      }
      return { message: 'Swagger spec not generated yet' };
    } catch (error) {
      return { error: 'Failed to load swagger spec' };
    }
  }

  @Get()
  getSwaggerUI() {
    return {
      message: 'Swagger UI is not available with Hono adapter',
      spec: '/api/swagger/spec.json',
      alternative: 'Use Swagger Editor (https://editor.swagger.io) with the spec.json',
    };
  }
}
