import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseAd1699524684930 implements MigrationInterface {
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM ads');
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO ads (description, url, file_id) VALUES ('Тут могла би бути ваша реклама. Якщо цікаво - тицяйте на кнопку нижче', 'https://t.me/havrylenko_ivan', null)",
    );
  }
}
