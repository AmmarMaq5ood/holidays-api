const request = require('supertest');
const express = require('express');
const holidaysRouter = require('../src/routes/holidays');
const calendarificService = require('../src/services/calendarificService');
const NodeCache = require('node-cache');

jest.mock('node-cache');
jest.mock('../src/services/calendarificService');

const app = express();
app.use(express.json());
app.use('/api', holidaysRouter);

describe('GET /api/holidays', () => {
    const cache = new NodeCache();

    beforeEach(() => {
        cache.flushAll();
    });

    it('should return 400 if country or year is not provided', async () => {
        const response = await request(app).get('/api/holidays?country=pk');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Bad Request: 'country' and 'year' query parameters are required."
        });
    });

    it('should return 200 with cached data if available', async () => {
        const mockHolidays = [{
            name: 'New Year\'s Day', date: {"iso": "2024-01-01",}
        }];
        cache.get.mockReturnValueOnce(mockHolidays);

        const response = await request(app).get('/api/holidays?country=pk&year=2024');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockHolidays);
    });

    it('should fetch holidays from Calendarific API if not cached', async () => {
        const mockHolidays = [{name: 'New Year', date: '2024-01-01'}];
        calendarificService.getHolidays.mockResolvedValueOnce(mockHolidays);

        const response = await request(app).get('/api/holidays?country=pk&year=2024');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockHolidays);
        expect(calendarificService.getHolidays).toHaveBeenCalledWith('pk', '2024');
    });

    it('should return 500 if an error occurs while fetching holidays', async () => {
        calendarificService.getHolidays.mockRejectedValueOnce(new Error('API Error'));

        const response = await request(app).get('/api/holidays?country=pk&year=2024');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            message: 'Error fetching holidays',
            error: 'API Error'
        });
    });
})
;