const request = require('supertest');
const express = require('express');
const countriesRouter = require('../src/routes/countries');
const calendarificService = require('../src/services/calendarificService');
const NodeCache = require('node-cache');

jest.mock('node-cache');
jest.mock('../src/services/calendarificService');

const app = express();
app.use(express.json());
app.use('/api', countriesRouter);

const mockCacheInstance = {
    get: jest.fn(),
    set: jest.fn(),
    flushAll: jest.fn(),
};

NodeCache.mockImplementation(() => mockCacheInstance);

describe('GET /api/countries', () => {
    beforeEach(() => {
        mockCacheInstance.flushAll.mockClear();
        mockCacheInstance.get.mockClear();
        mockCacheInstance.set.mockClear();
    });

    it('should return 200 with cached data if available', async () => {
        const mockCountries = [{
            "country_name": "Pakistan",
            "iso-3166": "PK",
            "total_holidays": 55,
            "supported_languages": 4,
            "uuid": "1cd3c693132f4c31b5b5e5f4c5eed6bd",
            "flag_unicode": "🇵🇰"
        }];

        mockCacheInstance.get.mockReturnValueOnce(mockCountries);
        const response = await request(app).get('/api/countries');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCountries);
    });

    it('should fetch countries from Calendarific API if not cached', async () => {
        const mockCountries = [{
            "country_name": "Pakistan",
            "iso-3166": "PK",
            "total_holidays": 55,
            "supported_languages": 4,
            "uuid": "1cd3c693132f4c31b5b5e5f4c5eed6bd",
            "flag_unicode": "🇵🇰"
        }];

        calendarificService.getCountries.mockResolvedValueOnce(mockCountries);

        const response = await request(app).get('/api/countries');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCountries);
        expect(calendarificService.getCountries).toHaveBeenCalled();
        expect(mockCacheInstance.set).toHaveBeenCalledWith('countries', mockCountries);
    });

    it('should return 500 if an error occurs while fetching countries', async () => {
        calendarificService.getCountries.mockRejectedValueOnce(new Error('API Error'));

        const response = await request(app).get('/api/countries');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            message: 'Error fetching countries',
            error: 'API Error'
        });
    });
});