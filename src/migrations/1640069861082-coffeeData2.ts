import {MigrationInterface, QueryRunner} from "typeorm";

export class coffeeData21640069861082 implements MigrationInterface {
    name = 'coffeeData21640069861082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" ADD "remark" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "remark"`);
    }

}
