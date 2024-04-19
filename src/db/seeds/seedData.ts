import fs from 'fs';
import { Knex } from 'knex';

interface Record {
	given: string;
	family: string;
	birthDate: Date;
	appointment: Date;
	mrn: number;
	location: string;
	generalPractitioner: {
		given: string;
		family: string;
		npi: number;
	};
}

export const seed = async (knex: Knex) => {
	console.log('Beginning database seeding.');
	const records: Record[] = JSON.parse(
		fs.readFileSync('src/db/seeds/data.json', 'utf-8'),
	);
	console.log(`Seeding ${records.length} records`);
	// TODO: add your database hydration logic here
	console.log('Database seeding complete.');
};
