import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReplyModule, TelegramModule, UserModule } from './services';
import { AppUpdate } from './controllers';
import { DatabaseModule } from './services';
import { UserUseCasesModule } from './use-cases/user';
import { ReplyUseCasesModule } from './use-cases/reply';
import { I18nModule } from './services/i18n/i18n.module';
import { RegisterWizard } from './controllers/register.wizard';
import { GameModule } from './services/game/game.module';
import { GameUseCasesModule } from './use-cases/game';

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
    I18nModule,
  ],
  providers: [AppUpdate, RegisterWizard],
})
export class AppModule {}
