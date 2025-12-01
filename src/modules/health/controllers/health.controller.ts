import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { TransformResponseInterceptor } from '@/interceptors/response.interceptor';
import { ApiCustomHeader } from '@/shared/swagger/decorator';

@ApiTags('Health')
@ApiCustomHeader()
@UseInterceptors(TransformResponseInterceptor)
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
    ]);
  }

  @Get('ping')
  ping() {
    return {
      message: 'pong',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
