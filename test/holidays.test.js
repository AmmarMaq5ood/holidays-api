const request = require('supertest');
const express = require('express');
const holidaysRouter = require('../src/routes/holidays');
const calendarificService = require('../src/services/calendarificService');
const cache = require('../src/cache');

const app = express();
app.use('/api', holidaysRouter);

jest.mock('../src/services/calendarificService');
jest.mock('../src/cache');

describe('GET /api/holidays', () => {
    beforeEach(() => {
        cache.get.mockClear();
        cache.set.mockClear();
    });

    it('should return 400 if country or year is missing', async () => {
        const response = await request(app).get('/api/holidays?country=US');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Bad Request: 'country' and 'year' query parameters are required.");
    });

    it('should return 400 if year is invalid', async () => {
        const response = await request(app).get('/api/holidays?country=US&year=202');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Bad Request: 'year' parameter must be a 4-digit number.");
    });

    it('should return holidays from service and cache them', async () => {
        const holidaysData = [{ holiday: 'New Year\'s Day', date: '2024-01-01' }];
        calendarificService.getHolidays.mockResolvedValueOnce(holidaysData);
        const response = await request(app).get('/api/holidays?country=US&year=2024');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(holidaysData);
        expect(cache.set).toHaveBeenCalledWith('US-2024', holidaysData);
    });

    it('should return 500 if there is an error fetching holidays', async () => {
        calendarificService.getHolidays.mockRejectedValueOnce(new Error('Some error'));
        const response = await request(app).get('/api/holidays?country=US&year=2024');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Unexpected error occurred');
    });
});