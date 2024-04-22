export interface Provider {
    id: number,
    firstName: string,
    lastName: string,
    npi: string,
}

export interface Patient {
    id: number,
    firstName: string,
    lastName: string,
    mrn: string,
    birthDate: Date,
    appointment: Date,
    location: string,
    generalPractitioner: Provider
}
