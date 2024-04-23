import { db } from '../../db';
import { Provider } from '../../models';


export type ProviderResponse = Omit<Provider, 'id'>;

export const getProvidersByLocation = async (location: string): Promise<ProviderResponse[]> => {
    let providers: ProviderResponse[] = [];

    try {
        providers = await db<ProviderResponse>('provider')
            .select(
                'provider.first_name as firstName',
                'provider.last_name as lastName',
                'npi',
            )
            .join('patient', 'patient.general_practitioner_id', '=', 'provider.id')
            .where('patient.location', location)
            .orderBy('lastName')
            .orderBy('firstName')
    } catch (error) {
        console.error('Error fetching providers', error);
        throw error;
    }

    return providers;
};
