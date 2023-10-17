import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
    }),
  ],
})
export class MockDatabaseModule {}
