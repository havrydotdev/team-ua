import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReplyModule, TelegramModule, UserModule } from './services';
import { AppUpdate } from './controllers';
import { DatabaseModule } from './services';
import { UserUseCasesModule } from './use-cases/user';
import { ReplyUseCasesModule } from './use-cases/reply';
import { I18nModule } from './services/i18n/i18n.module';

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
    I18nModule,
  ],
  controllers: [],
  providers: [AppUpdate],
})
export class AppModule {}
