import { app, PORT } from './src/app';
import { db } from './src/db';

app.listen(PORT, async () => {
	await db.migrate.up();
	await db.seed.run();
	console.log(`App Listening on http://localhost:${PORT}`);
});
