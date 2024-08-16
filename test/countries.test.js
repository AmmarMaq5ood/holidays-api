const request = require('supertest');
const express = require('express');
const countriesRouter = require('../src/routes/countries');
const calendarificService = require('../src/services/calendarificService');
const NodeCache = require('node-cache');

const app = express();
app.use('/api', countriesRouter);

jest.mock('../src/services/calendarificService');
jest.mock('node-cache');

describe('GET /api/countries', () => {
    beforeEach(() => {
        NodeCache.prototype.get.mockClear();
        NodeCache.prototype.set.mockClear();
    });

    it('should return cached data if available', async () => {
        const countriesData = [{ 'country_name': 'Pakistan', 'iso-3166': 'PK' }];
        NodeCache.prototype.get.mockReturnValueOnce(countriesData);
        const response = await request(app).get('/api/countries');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(countriesData);
    });

    it('should return countries from service and cache them', async () => {
        const countriesData = [{ country_name: 'Pakistan', 'iso-3166': 'PK' }];
        calendarificService.getCountries.mockResolvedValueOnce(countriesData);
        const response = await request(app).get('/api/countries');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(countriesData);
        expect(NodeCache.prototype.set).toHaveBeenCalledWith('countries', countriesData);
    });

    it('should return 404 if no countries data is found', async () => {
        calendarificService.getCountries.mockResolvedValueOnce([]);
        const response = await request(app).get('/api/countries');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No countries data found');
    });

    it('should return 500 if there is an error fetching countries', async () => {
        calendarificService.getCountries.mockRejectedValueOnce(new Error('Some error'));
        const response = await request(app).get('/api/countries');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Unexpected error occurred');
    });
});