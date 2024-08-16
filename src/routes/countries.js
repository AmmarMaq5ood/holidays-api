const express = require('express');
const calendarificService = require('../services/calendarificService');
const NodeCache = require('node-cache');

const router = express.Router();
const cache = new NodeCache();

router.get('/countries', async (req, res) => {
    const cacheKey = 'countries';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return res.status(200).json(cachedData);
    }

    try {
        const countries = await calendarificService.getCountries();

        if (!Array.isArray(countries) || countries.length === 0) {
            return res.status(404).json({ message: 'No countries data found' });
        }

        cache.set(cacheKey, countries);
        res.status(200).json(countries);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json({
                message: 'Error fetching countries from API',
                error: error.response.data.message || error.message,
            });
        } else if (error.request) {
            return res.status(503).json({
                message: 'No response received from Calendarific API',
                error: 'Service Unavailable',
            });
        } else {
            return res.status(500).json({
                message: 'Unexpected error occurred',
                error: error.message,
            });
        }
    }
});

module.exports = router;