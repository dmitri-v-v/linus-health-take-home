import { Router } from 'express';
import { getAppointmentsByDateRange } from '../services/appointmentService';
import { getHealthStatus } from '../services/healthService';
import { 
	filterPatients, 
	FilterPatientsResponse, 
	getPatientData, 
	PatientDetailsResponse 
} from '../services/patientService';


export const router = Router({});

/**
 * Validates that the provided `params` in the request `req` object are all strings. If any are not, uses the response `res` 
 * object to send a 400 response.
 * 
 * @param req The request containing the query params
 * @param res The response that will be sent if any of the params are invalid
 * @param params The list of parameter names to check
 * @returns 
 */
function validateQueryParams(req: any, res: any, ...params: any[]) {
	for (const param of params) {
		const value = req.query[param];

		if (value && typeof value !== 'string') {
			return res.status(400).json({ error: `Invalid query parameter type. ${param} must be a string.` });
		}
	}
}

function validateDateQueryParameter(paramName: string, dateValue: string | undefined, res: any): any {
	const date = dateValue? new Date(dateValue): undefined;

	if (date && isNaN(date.getTime())) {
		return res.status(400).json({ error: `${paramName} is not a valid date.`});
	}

	return date?.toISOString().slice(0,10)
}
  
/**
 * A health check that uses an optional query parameter
 */
router.get('/health', async (req, res) => {
	res.json(await getHealthStatus(req.query.status?.toString()));
});

/**
 * The endpoint for retrieving patients and their details by various filter criteria, such as:
 *  * first name
 *  * last name
 *  * birth date
 *  * Their provider's NPI
 */
router.get('/patients', async (req, res): Promise<FilterPatientsResponse | Record<string, any>> => {
	const queryParamsValidationResponse = validateQueryParams(req, res, 'firstName', 'lastName', 'birthDate', 'npi');

	if (queryParamsValidationResponse) {
		return queryParamsValidationResponse;
	}

	try {
		let { firstName, lastName, birthDate, npi } = req.query as {
			firstName?: string;
			lastName?: string;
			birthDate?: string;
			npi?: string;
		};
		
		// Validate the birthDate parameter:
		const validatedBirthDate = validateDateQueryParameter('birthDate', birthDate, res);

		if (validatedBirthDate && typeof validatedBirthDate !== 'string' ) {
			return validatedBirthDate; // Means we got the invalid date response.
		}

		const patients = await filterPatients(firstName, lastName, validatedBirthDate, npi);

		if (patients.length === 0) {
			return res.status(404).json({ message: 'No patients found matching the filter criteria.'});
		}
		return res.json(patients);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'An error occurred while retrieving patients' });
	}
});

/**
 * The endpoint for retrieving a patient's details by their MRN.
 */
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

/**
 * The endpoint for retrieving a list of appointments by a date range.
 */
router.get('/appointments', async (req, res) => {
    try {
        const { startDate, endDate } = req.query as {
			startDate?: string,
			endDate?: string
		};

		if (!startDate || !endDate) {
			return res.status(400).json({error: 'Both startDate and endDate query parameters are required.'});
		}

		const validatedStartDate = validateDateQueryParameter('startDate', startDate, res);
		const validatedEndDate = validateDateQueryParameter('endDate', endDate, res);

		if (typeof validatedStartDate !== 'string') {
			return validatedStartDate;
		}

		if (typeof validatedEndDate !== 'string') {
			return validatedEndDate;
		}

        const appointments = await getAppointmentsByDateRange(startDate, endDate);

		if (appointments.length === 0) {
			return res.status(404).json({ message: 'No appointments found within that date range.'});
		}
        
		return res.json(appointments);
    } catch (err) {
        console.error(err);
		res.status(500).json({ error: 'An error occurred while retrieving the appointments.' });
    }
});