import { Patient } from '../../models';
import { db } from '../../db';

export interface FilterPatientsResponse {
    firstName: string,
    lastName: string,
    mrn: string,
    birthDate: Date,
}

export type PatientDetailsResponse = Omit<Patient, 'generalPractitioner' | 'id'> | null;

export const filterPatients = async (firstName?: string, lastName?: string, birthDate?: string, npi?: string): 
    Promise<FilterPatientsResponse[]> => {
    let query = db<FilterPatientsResponse>('patient');

    if (firstName) {
        query = query.where('first_name', firstName);
    }

    if (lastName) {
        query = query.where('last_name', lastName);
    }

    if (birthDate) {
        query = query.where('birth_date', birthDate);
    }

    if (npi) {
        let provider;

        try {
            provider = await db('provider').select('id').where('npi', npi).first();
        } catch (error) {
            console.error('Error finding provider', error);
            throw error;
        }

        // If we didn't find a matching provider, can return early as no patients possible matching all filters:
        if (!provider) {
            return [];
        }

        query = query.where('general_practitioner_id', provider.id);
    }

    let patients: FilterPatientsResponse[] = [];

    try {
        patients = await query.select(
            'mrn', 
            'first_name as firstName', 
            'last_name as lastName', 
            'birth_date as birthDate'
        )
        .orderBy('lastName').orderBy('firstName');
    } catch (error) {
        console.error('Error fetching patients', error);
        throw error;
    }

    return patients;
}

export const getPatientData = async (mrn: string): Promise<PatientDetailsResponse> => {
    let patientRecord;

    try {
        patientRecord = await db('patient').select('*').where('mrn', mrn).first();
    } catch (error) {
        console.error('Error fetching patient data', error);
        throw error;
    }

    if (patientRecord) {
        return { 
            mrn: patientRecord.mrn,
            firstName: patientRecord.first_name,
            lastName: patientRecord.last_name,
            birthDate: patientRecord.birth_date,
            appointment: patientRecord.appointment_date,
            location: patientRecord.location
         };
    } else {
        return null;
    }
}
