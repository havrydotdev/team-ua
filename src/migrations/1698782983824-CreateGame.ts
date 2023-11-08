import * as fs from 'fs';
import { join } from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

const readSqlFile = (filepath: string): string[] => {
  return fs
    .readFileSync(join(__dirname, filepath))
    .toString()
    .replaceAll(/\r?\n|\r/g, '')
    .split(';')
    .filter((query) => query?.length);
};

export class CreateGame1698782983824 implements MigrationInterface {
  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE "games"`);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = readSqlFile('../../migrations.sql');

    for (let i = 0; i < queries.length; i++) {
      await queryRunner.query(queries[i]);
    }
  }
}
