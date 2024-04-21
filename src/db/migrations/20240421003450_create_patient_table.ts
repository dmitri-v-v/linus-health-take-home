import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	const tableExists = await knex.schema.hasTable('patient');

	if (!tableExists) {
		console.log('Creating Patient table');

		return knex.schema.createTable('patient', table => {
			table.increments('id');
			table.string('mrn').unique().index();
			table.string('first_name').notNullable();
			table.string('last_name').notNullable();
			table.date('birth_date').notNullable();
			table.date('appointment_date').notNullable();
			table.string('location').notNullable();
			table.integer('general_practitioner_id').references('id').inTable('provider').notNullable();
		});
	}
}


export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable('patient');
