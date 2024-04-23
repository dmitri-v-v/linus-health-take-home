import { Router } from 'express';
import { AppointmentResponse, getAppointmentsByDateRange } from '../services/appointmentService';
import { getHealthStatus } from '../services/healthService';
import { 
	filterPatients, 
	FilterPatientsResponse, 
	getPatientData, 
	PatientDetailsResponse 
} from '../services/patientService';
import { getProvidersByLocation, ProviderResponse } from '../services/providerService';


export const router = Router({});

/**
 * Validates that the provided `params` in the request `req` object are all strings. If any are not, uses the response `res` 
 * object to send a 400 response. This was mainly added to aid with TypeScript's type enforcement.
 * 
 * @param req The request containing the query params
 * @param res The response that will be sent if any of the params are invalid
 * @param params The list of parameter names to check
 * @returns True if all query parameters are strings, false otherwise.
 */
function validateQueryParamIsString(req: any, res: any, ...params: string[]): boolean {
	for (const param of params) {
		const value = req.query[param];

		if (value && typeof value !== 'string') {
			res.status(400).json({ error: `Invalid query parameter type. ${param} must be a string.` });
			return false;
		}
	}

	return true;
}

/**
 * Validates that the provided dte query parameter is in a valid date format (i.e. one that Date class can parse automatically).
 * If it's not, modifies the provided `res` object with the corresponding error message and sends the Response.
 * If it is, returns the provided date formatted as the services expect it. This allows dates to be specified in any valid
 * format in the query parameter to still work.
 * 
 * @param paramName Used only for constructing the error message to be sent.
 * @param dateValue 
 * @param res 
 * @returns `dateValue` in proper format, or void if it's not a valid Date.
 */
function validateDateQueryParameter(paramName: string, dateValue: string | undefined, res: any): string | undefined {
	const date = dateValue? new Date(dateValue): undefined;

	if (date && isNaN(date.getTime())) {
		res.status(400).json({ error: `${paramName} is not a valid date.`});
		return;
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
router.get('/patients', async (req, res): Promise<void> => {
	try {
		if (!validateQueryParamIsString(req, res, 'firstName', 'lastName', 'birthDate', 'npi')) {
			return; // Response already sent.
		}

		let { firstName, lastName, birthDate, npi } = req.query as {
			firstName?: string;
			lastName?: string;
			birthDate?: string;
			npi?: string;
		};
		
		// Validate the birthDate parameter:
		const validatedBirthDate = validateDateQueryParameter('birthDate', birthDate, res);

		if (!validatedBirthDate) {
			return; // Means we sent the invalid date response.
		}

		const patients: FilterPatientsResponse[] = await filterPatients(firstName, lastName, validatedBirthDate, npi);

		if (patients.length === 0) {
			res.status(404).json({ message: 'No patients found matching the filter criteria.'});
		} else {
			res.json(patients);
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'An error occurred while retrieving patients' });
	}
});

/**
 * The endpoint for retrieving a patient's details by their MRN.
 */
router.get('/patients/:mrn', async (req, res): Promise<void> => {
	const { mrn } = req.params;

	try {
		const patient: PatientDetailsResponse = await getPatientData(mrn);

		if (patient) {
			res.json(patient);
		} else {
			res.status(404).json({ message: 'No patient found with that mrn.'});
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'An error occurred while retrieving the patient' });
	  }
});

/**
 * The endpoint for retrieving a list of appointments by a date range.
 */
router.get('/appointments', async (req, res): Promise<void> => {
    try {
		if (!validateQueryParamIsString(req, res, 'startDate', 'endDate')) {
			return; // Response already sent.
		}

		const startDate = req.query.startDate as string;
		const endDate = req.query.endDate as string;

		if (!startDate || !endDate) {
			res.status(400).json({error: 'Both startDate and endDate query parameters are required.'});
			return;
		}

		const validatedStartDate = validateDateQueryParameter('startDate', startDate, res);
		const validatedEndDate = validateDateQueryParameter('endDate', endDate, res);

		if (!validatedStartDate || !validatedEndDate) {
			return;
		}

        const appointments: AppointmentResponse[] = await getAppointmentsByDateRange(validatedStartDate, validatedEndDate);

		if (appointments.length === 0) {
			res.status(404).json({ message: 'No appointments found within that date range.'});
		} else {
			res.json(appointments);
		}
    } catch (err) {
        console.error(err);
		res.status(500).json({ error: 'An error occurred while retrieving the appointments.' });
    }
});

/**
 * The endpoint for retrieving the health providers for a given location.
 */
router.get('/providers', async (req, res): Promise<void> => {
	if (!req.query.location) {
		res.status(400).json({ error: 'location is a required query parameter'});
		return;
	}

	if (!validateQueryParamIsString(req, res, 'location')) {
		return;
	}

	try {
		const location = req.query.location as string;

		const providers: ProviderResponse[] = await getProvidersByLocation(location);

		if (providers.length === 0) {
			res.status(404).json({ message: 'No providers found for that location.'});
		} else {
			res.json(providers);
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'An error occurred while retrieving providers' });
	}
});
