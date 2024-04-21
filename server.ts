import { app, PORT } from './src/app';
import { db } from './src/db';

app.listen(PORT, async () => {
	try {
		await db.migrate.latest();
		console.log('Migrations completed');

		await db.seed.run();
		console.log('Seeding completed');
		console.log(`App Listening on http://localhost:${PORT}`);
	} catch (error) {
		console.error('Error setting up database:', error);
	}
});
