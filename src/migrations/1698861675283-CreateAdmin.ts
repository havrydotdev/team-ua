import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdmin1698861675283 implements MigrationInterface {
  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query("DELETE FROM users WHERE role = 'admin'");
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      "INSERT INTO users (id, role) VALUES (717463814, 'admin')",
    );
  }
}
