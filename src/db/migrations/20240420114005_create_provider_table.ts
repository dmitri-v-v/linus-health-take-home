import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	const tableExists = await knex.schema.hasTable('provider');

	if (!tableExists) {
		console.log('Creating provider table');

		return knex.schema.createTable('provider', table => {
			table.string('npi').primary();
			table.string('first_name').notNullable();
			table.string('last_name').notNullable();
		});
	}
}


export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable('provider');
