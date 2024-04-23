import { filterPatients, getPatientData, FilterPatientsResponse, PatientDetailsResponse } from '../services/patientService';
import { db } from '../db';

jest.mock('../db');

describe('filterPatients', () => {
	it('should return an empty array if no provider is found', async () => {
		const patients = await filterPatients(undefined, undefined, undefined, '123');
		expect(patients).toEqual([]);
	});

	it('should return patients matching the given firstName', async () => {
	});

	it('should return patients matching the given lastName', async () => {
	});

	it('should return patients matching the given birthDate', async () => {
	});

	it('should return patients matching the given provider npi', async () => {
	});
	
});

describe('getPatientData', () => {
	it('should return null if no patient record is found', async () => {
		const patientData = await getPatientData('123');
		expect(patientData).toBeNull();
	});

	it('should return patient details for a valid mrn', async () => {
	});
});
