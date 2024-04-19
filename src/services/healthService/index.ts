import { db } from '../../db';

export const getHealthStatus = async (statusOverride?: string) => {
	const status = statusOverride ?? 'healthy';
	const result = await db.raw<{ status: string }[]>(
		`SELECT '${status}' as status`,
	);
	return result[0];
};
