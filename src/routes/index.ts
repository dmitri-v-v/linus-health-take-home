import { Router } from 'express';
import { getHealthStatus } from '../services/healthService';

export const router = Router({});

/**
 * A health check that uses an optional query parameter
 */
router.get('/health', async (req, res) => {
	res.json(await getHealthStatus(req.query.status?.toString()));
});
