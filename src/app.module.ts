import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

import { AppUpdate } from './controllers/updates';
import {
  ChangeLangWizard,
  NextActionWizard,
  ProfilesWizard,
  RegisterWizard,
} from './controllers/wizards';
import { ClearLastProfilesWizard } from './controllers/wizards';
import { SendMessageWizard } from './controllers/wizards';
import {
  BotExceptionFilter,
  ProfileExceptionFilter,
  UnexpectedExceptionFilter,
} from './core/filters';
import { RoleGuard } from './core/guards';
import { ProfileGuard } from './core/guards/profile.guard';
import { I18nInterceptor } from './core/interceptors';
import {
  DatabaseModule,
  ReplyModule,
  TelegramModule,
  UserModule,
} from './services';
import { GameModule } from './services/game/game.module';
import { I18nModule } from './services/i18n/i18n.module';
import { ProfileModule } from './services/profile/profile.module';
import { ReportModule } from './services/report/report.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { GameUseCasesModule } from './use-cases/game';
import { ProfileUseCasesModule } from './use-cases/profile';
import { ReplyUseCasesModule } from './use-cases/reply';
import { ReportUseCasesModule } from './use-cases/report/report.use-case.module';
import { UserUseCasesModule } from './use-cases/user';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as unknown as CacheStore,
        ttl: 24 * 60 * 60, // 1 day
        url: configService.get<string>('REDIS_URL'),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegramModule,
    DatabaseModule,
    SubscribersModule,
    UserModule,
    UserUseCasesModule,
    ReplyModule,
    ReplyUseCasesModule,
    GameModule,
    GameUseCasesModule,
    ProfileModule,
    ProfileUseCasesModule,
    ReportModule,
    ReportUseCasesModule,
    I18nModule,
  ],
  providers: [
    AppUpdate,
    RegisterWizard,
    ChangeLangWizard,
    NextActionWizard,
    ProfilesWizard,
    ClearLastProfilesWizard,
    SendMessageWizard,
    {
      provide: APP_INTERCEPTOR,
      useClass: I18nInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: UnexpectedExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BotExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ProfileExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ProfileGuard,
    },
  ],
})
export class AppModule {}
