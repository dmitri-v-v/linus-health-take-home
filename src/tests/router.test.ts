import express, { Express } from 'express';
import { router } from '../routes';

const app: Express = express();
app.use(express.json());
app.use('/', router);

describe('GET /patients', () => {
	it('should return 400 if firstName is not a string', async () => {
	});

	it('should return 400 if lastName is not a string', async () => {
	});

	it('should return 400 if birthDate is not a string', async () => {
	});

	it('should return 400 if npi is not a string', async () => {
	});

	it('should return 400 if no query params are given', async () => {
	});

	it('should return 400 if birthDate query param is not a valid date', async () => {
	});

	it('should return 404 if no patients match the query params', async () => {
	});

	it('should return list of patients that match the given firstName', async () => {
	});

	it('should return list of patients that match the given lastName', async () => {
	});

	it('should return list of patients that match the given birthDate', async () => {
	});

	it('should return list of patients that match the given provider npi', async () => {
	});

	it('should be possible to combine multiple query params to narrow down results', async () => {
	});
});

describe('GET /patients/:mrn', () => {
	it('should return 404 if no patient found with that mrn', async () => {
	});

	it('should return patient details for valid mrn', async () => {
	});
});

describe('GET /appointments', () => {
	it('should return 400 if startDate or endDate is not a string', async () => {
	});

	it('should return 400 if startDate or endDate is missing', async () => {
	});

	it('should return 400 if startDate or endDate are not valid dates', async () => {
	});

	it('should return 404 if there are no appointments between the given startDate and endDate', async () => {
	});

	it('should return list of appointments for valid startDate and endDate range', async () => {
	});
});

describe('GET /providers', () => {
	it('should return 400 if location is missing', async () => {
	});

	it('should return 400 if location query parameter is not a string', async () => {
	});

	it('should return 404 if the given location does not exist', async () => {
	});

	it('should return list of providers for a valid location', async () => {
	});
});
