import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppUpdate } from './controllers/updates';
import {
  ChangeLangWizard,
  NextActionWizard,
  ProfilesWizard,
  RegisterWizard,
} from './controllers/wizards';
import { GlobalFilter } from './core/filters';
import { ContextInterceptor, I18nInterceptor } from './core/interceptors';
import {
  DatabaseModule,
  ReplyModule,
  TelegramModule,
  UserModule,
} from './services';
import { FileModule } from './services/file/file.module';
import { GameModule } from './services/game/game.module';
import { I18nModule } from './services/i18n/i18n.module';
import { ProfileModule } from './services/profile/profile.module';
import { FileUseCasesModule } from './use-cases/file';
import { GameUseCasesModule } from './use-cases/game';
import { ProfileUseCasesModule } from './use-cases/profile';
import { ReplyUseCasesModule } from './use-cases/reply';
import { UserUseCasesModule } from './use-cases/user';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegramModule,
    DatabaseModule,
    UserModule,
    UserUseCasesModule,
    ReplyModule,
    ReplyUseCasesModule,
    GameModule,
    GameUseCasesModule,
    FileModule,
    FileUseCasesModule,
    ProfileModule,
    ProfileUseCasesModule,
    I18nModule,
  ],
  providers: [
    AppUpdate,
    RegisterWizard,
    ChangeLangWizard,
    NextActionWizard,
    ProfilesWizard,
    {
      provide: APP_INTERCEPTOR,
      useClass: I18nInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalFilter,
    },
  ],
})
export class AppModule {}
