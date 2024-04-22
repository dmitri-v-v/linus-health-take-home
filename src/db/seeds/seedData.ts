import crypto from 'crypto';
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

function hashRecord(record: Record) {
	const hash = crypto.createHash('sha256');
	hash.update(JSON.stringify(record));
	return hash.digest('hex');
  }

export const seed = async (knex: Knex) => {
	console.log('Beginning database seeding.');

	// Deletes ALL existing entries:
	await knex('patient').del();
	await knex('provider').del();
	
	const records: Record[] = JSON.parse(
		fs.readFileSync('src/db/seeds/data.json', 'utf-8'),
	);

	console.log(`Seeding ${records.length} records`);

	// Process the records in chunks of 100:
	for (let i = 0; i < records.length; i += 100) {
		console.log(`Processing records ${i + 1} to ${i + 101}`);

		for (const record of records.slice(i, i + 100)) {
			let provider;

			// Insert the provider if they don't exist; if it already exists, update the existing value:
			try {
				[provider] = await knex('provider').insert({
					npi: record.generalPractitioner.npi,
					first_name: record.generalPractitioner.given,
					last_name: record.generalPractitioner.family,
				}).returning('*').onConflict('npi').merge();
			} catch (error) {
				// TODO: Find way to remove sensitive info from error msg.
				console.error(`An error occurred adding provider for record ${hashRecord(record)}: `, error);
			}

			if (provider) {
				let patient;

				try {
					[patient] = await knex('patient').insert({
						mrn: record.mrn,
						first_name: record.given,
						last_name: record.family,
						birth_date: record.birthDate,
						appointment_date: record.appointment,
						location: record.location,
						general_practitioner_id: provider.id,
					});

					if (patient) {
						console.log(`Added patient record ${hashRecord(record)}`);
					} else {
						console.error(`Patient not added for record ${hashRecord(record)}`);
					}
				} catch (error) {
					// TODO: Find way to remove sensitive info from error msg.
					console.error(`An error occurred adding patient for record ${hashRecord(record)}: `, error);
				}
			} else {
				console.error(`Provider not added for record ${hashRecord(record)}`);
			}
		}
	}
	console.log('Database seeding complete.');
};
