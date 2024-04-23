import { db } from '../../db';

export interface AppointmentResponse {
    appointmentDate: string,
    location: string,
    patient: {
        firstName: string,
        lastName: string,
        mrn: string,
    },
    provider: {
        firstName: string,
        lastName: string,
        npi: string,
    }
}

export const getAppointmentsByDateRange = async (startDate: string, endDate: string): Promise<AppointmentResponse[]> => {
    let appointments: any[] = [];

    try {
        appointments = await db('patient')
            .select(
                'appointment_date', 
                'location', 
                'patient.first_name as patient_first_name', 
                'patient.last_name as patient_last_name',
                'provider.first_name as provider_first_name',
                'provider.last_name as provider_last_name',
                'npi',
                'mrn'
            )
            .join('provider', 'patient.general_practitioner_id', '=', 'provider.id')
            .whereBetween('appointment_date', [startDate, endDate])
            .orderBy('appointment_date')
            .orderBy('location')
            .orderBy('mrn');
    } catch (error) {
        console.error('Error fetching appointments', error);
    }
    
    return appointments.map(record => ({
        appointmentDate: record.appointment_date,
        location: record.location,
        patient: {
            firstName: record.patient_first_name,
            lastName: record.patient_last_name,
            mrn: record.mrn,
        },
        provider: {
            firstName: record.provider_first_name,
            lastName: record.provider_last_name,
            npi: record.npi,
        }
    }));
}