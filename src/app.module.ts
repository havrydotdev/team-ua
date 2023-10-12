import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule, UserModule } from './services';
import { AppUpdate } from './updates';
import { DatabaseModule } from './services';
import { UserUseCaseModule } from './use-cases/user';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegramModule,
    DatabaseModule,
    UserModule,
    UserUseCaseModule,
  ],
  controllers: [],
  providers: [AppUpdate],
})
export class AppModule {}
