import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTableIfNotExists('provider', table => {
		table.string('npi').primary();
		table.string('first_name');
		table.string('last_name');
	});
}

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable('provider');
