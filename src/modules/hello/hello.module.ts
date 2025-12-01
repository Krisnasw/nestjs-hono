import { Module } from '@nestjs/common';
import { HelloController } from './controllers/hello.controller';
import { HelloService } from './services/hello.service';
import { HelloRepository } from './repositories/hello.repository';

@Module({
  imports: [],
  controllers: [HelloController],
  providers: [HelloService, HelloRepository],
})
export class HelloModule {}