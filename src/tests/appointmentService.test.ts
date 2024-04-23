import { getAppointmentsByDateRange, AppointmentResponse } from '../services/appointmentService';

jest.mock('../db');

describe('getAppointmentsByDateRange', () => {
	it('should return appointments within the given date range', async () => {
	});

	it('should return empty list if endDate greater than startDate', async () => {
	});
});
