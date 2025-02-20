import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertAdminUser1708419843000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      INSERT INTO users (uuid, created_at, updated_at, username, password, full_name, first_name, last_name, status, mail, phone, role)
      VALUES 
      ('5fd7ecaf-f91d-4073-9475-7b21be611303', '2025-02-20 14:05:42.601895', '2025-02-20 14:05:42.601895',
      'admin', '$2b$05$DzJxvjPF07wavByYBCukFu3mfFnGFTONOEppZSMiYeL3qeRCpO/7C', 
      'admin', 'admin', 'admin', 'ACTIVE', 'admin@gmail.com', '0985369476', 'USER');
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DELETE FROM users WHERE id = '5fd7ecaf-f91d-4073-9475-7b21be611303';
    `);
    }
}
