import { db } from '../../db';

export interface FilterPatientsResponse {
    firstName: string,
    lastName: string,
    mrn: string,
    birthDate: Date,
}

export const filterPatients = async (firstName?: string, lastName?: string, birthDate?: string): Promise<FilterPatientsResponse[]> => {
    let query = db('patient');

    if (firstName) {
        query = query.where('first_name', firstName);
    }

    if (lastName) {
        query = query.where('last_name', lastName);
    }

    if (birthDate) {
        query = query.where('birth_date', birthDate);
    }

    const results = await query.select();

    return results.map(record => ({
        firstName: record.first_name,
        lastName: record.last_name,
        mrn: record.mrn,
        birthDate: record.birth_date,
    }));
}