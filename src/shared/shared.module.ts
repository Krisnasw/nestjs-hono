import { HttpModule } from '@nestjs/axios';
import { Module, Global } from '@nestjs/common';
import { SettingService } from './services/setting.service';
import { DatabaseService } from './database/database.service';
import { RedisService } from './redis/redis.service';
import { RabbitMQService, RabbitMQResilientService } from './rabbitmq';
import { SwaggerController } from './swagger/swagger.controller';

const providers = [
  SettingService,
  DatabaseService,
  RedisService,
  RabbitMQService,
  RabbitMQResilientService,
];

@Global()
@Module({
  providers,
  controllers: [SwaggerController],
  imports: [HttpModule],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
