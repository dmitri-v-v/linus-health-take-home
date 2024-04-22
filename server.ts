import { app, PORT } from './src/app';
import { db } from './src/db';

app.listen(PORT, async () => {
	try {
		const [batchNo, migrations]: [number, Array<string>] = await db.migrate.latest();

		migrations.forEach(file => {
			console.log(`Ran migration file ${file} in batch ${batchNo}.`);
		});

		const [seeds]: [Array<string>] = await db.seed.run();
		seeds.forEach(seed => {
			console.log(`Ran seed file ${seed}.`);
		})
		console.log(`App Listening on http://localhost:${PORT}`);
	} catch (error) {
		console.error('Error setting up database:', error);
	}
});
