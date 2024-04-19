import knex from 'knex';

export const db = knex({
	client: 'sqlite3',
	migrations: { directory: 'src/db/migrations' },
	seeds: { directory: 'src/db/seeds' },
	useNullAsDefault: true,
	connection: { filename: 'src/db/data.db' },
});
