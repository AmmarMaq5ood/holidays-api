const express = require('express');
const router = express.Router();
const calendarificService = require('../services/calendarificService');
const cache = require('../cache');

const iso3166Regex = /^[A-Z]{2,3}$/;

router.get('/holidays', async (req, res) => {
    let { country, year } = req.query;
    const cacheKey = `${country}-${year}`;

    if (country) {
        country = country.toUpperCase();
    }

    if (!country || !year) {
        return res.status(400).json({
            message: "Bad Request: 'country' and 'year' query parameters are required."
        });
    }

    if (!iso3166Regex.test(country)) {
        return res.status(400).json({
            message: "Bad Request: 'country' parameter must be a valid ISO 3166-1 alpha-2 or alpha-3 code."
        });
    }

    if (!/^\d{4}$/.test(year)) {
        return res.status(400).json({
            message: "Bad Request: 'year' parameter must be a 4-digit number."
        });
    }

    if (cache.has(cacheKey)) {
        return res.status(200).json(cache.get(cacheKey));
    }

    try {
        const holidays = await calendarificService.getHolidays(country, year);

        if (!Array.isArray(holidays)) {
            return res.status(500).json({
                message: 'Error: Invalid data format received from the Calendarific API.',
            });
        }

        cache.set(cacheKey, holidays);
        res.status(200).json(holidays);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json({
                message: 'Error fetching holidays from API',
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