import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule as CronModule } from '@nestjs/schedule';
import { ResilienceModule } from 'nestjs-resilience';

import { SettingService } from './shared/services/setting.service';
import { RequestContextModule } from '@medibloc/nestjs-request-context';
import { AbstractRequestContext } from './common/contexts/abstract-request.context';
import { SharedModule } from './shared/shared.module';
import { HelloModule } from './modules/hello/hello.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        safe: true,
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (settingService: SettingService) => ({
        secret: settingService.jwtConfig.secretKey,
      }),
      inject: [SettingService],
    }),
    RequestContextModule.forRoot({
      contextClass: AbstractRequestContext,
      isGlobal: true,
    }),
    ResilienceModule.forRoot({}),
    EventEmitterModule.forRoot(),
    CronModule.forRoot(),
    TerminusModule,
    SharedModule,
    HelloModule,
    HealthModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
