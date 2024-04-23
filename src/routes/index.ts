import { Router } from 'express';
import { getHealthStatus } from '../services/healthService';
import { filterPatients, FilterPatientsResponse, getPatientData, PatientDetailsResponse } from '../services/patientService';
export const router = Router({});

function validateQueryParams(req: any, res: any, ...params: any[]) {
	for (const param of params) {
	  const value = req.query[param];
	  if (value && typeof value !== 'string') {
		return res.status(400).json({ error: `Invalid query parameter type. ${param} must be a string.` });
	  }
	}
  }
  
/**
 * A health check that uses an optional query parameter
 */
router.get('/health', async (req, res) => {
	res.json(await getHealthStatus(req.query.status?.toString()));
});

/**
 * The endpoint for retrieving patients and their details.
 */
router.get('/patients', async (req, res): Promise<FilterPatientsResponse | Record<string, any>> => {
	const queryParamsValidationResponse = validateQueryParams(req, res, 'firstName', 'lastName', 'birthDate');

	if (queryParamsValidationResponse) {
		return queryParamsValidationResponse;
	}

	try {
		let { firstName, lastName, birthDate } = req.query as {
			firstName?: string;
			lastName?: string;
			birthDate?: string;
		};

		firstName = firstName?.trim();
		lastName = lastName?.trim();
		
		// Validate the birthDate parameter:
		const birthDateObj = birthDate? new Date(birthDate): undefined;

		if (birthDateObj && isNaN(birthDateObj.getTime())) {
			return res.status(400).json({ error: 'birthDate is not a valid date format'});
		}

		const patients = await filterPatients(firstName, lastName, birthDateObj?.toISOString().slice(0,10));

		if (patients.length === 0) {
			return res.status(404).json({ message: 'No patients found matching the filter criteria.'});
		}
		return res.json(patients);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'An error occurred while retrieving patients' });
	}
});

router.get('/patients/:mrn', async (req, res) => {
	const { mrn } = req.params;
	let patient: PatientDetailsResponse;

	try {
		patient = await getPatientData(mrn);

		if (patient) {
			return res.json(patient);
		} else {
			return res.status(404).json({ message: 'No patient found with that mrn.'});
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'An error occurred while retrieving the patient' });
	  }
});
