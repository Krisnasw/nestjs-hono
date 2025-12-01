import * as fs from 'fs';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SettingService } from '@/shared/services/setting.service';
import { ISwaggerConfigInterface } from '@/interfaces/swagger.interface';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(
  app: INestApplication,
  config: ISwaggerConfigInterface,
) {
  const configService = new SettingService();
  const options = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(config.version)
    .addServer(configService.app.url + '/api')
    .setContact('Sociolite', 'https://sociolite.id', 'hello@sociolite.id')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));

  SwaggerModule.setup(config.path, app, document);
}
