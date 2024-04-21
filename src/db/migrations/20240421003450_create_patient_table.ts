import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    console.log('Creating patient table');
    
    return knex.schema.createTableIfNotExists('patient', table => {
        table.string('mrn').primary();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.date('birth_date').notNullable();
        table.date('appointment_date').notNullable();
        table.string('location').notNullable();
        table.string('general_practitioner').references('npi').inTable('provider').notNullable();
    });
}


export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable('patient');
