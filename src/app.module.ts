import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReplyModule, TelegramModule, UserModule } from './services';
import { AppUpdate } from './controllers';
import { DatabaseModule } from './services';
import { UserUseCasesModule } from './use-cases/user';
import { ReplyUseCasesModule } from './use-cases/reply';
import { I18nModule } from './services/i18n/i18n.module';
import { RegisterWizard } from './controllers/wizards/register.wizard';
import { GameModule } from './services/game/game.module';
import { GameUseCasesModule } from './use-cases/game';
import { FileModule } from './services/file/file.module';
import { FileUseCasesModule } from './use-cases/file/file.use-case.module';
import { ProfileModule } from './services/profile/profile.module';
import { ProfileUseCasesModule } from './use-cases/profile/profile.use-case.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { I18nInterceptor } from './core/interceptors/i18n.interceptor';

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
    {
      provide: APP_INTERCEPTOR,
      useClass: I18nInterceptor,
    },
  ],
})
export class AppModule {}
