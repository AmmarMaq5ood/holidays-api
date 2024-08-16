const express = require('express');
const router = express.Router();
const calendarificService = require('../services/calendarificService');
const cache = require('../cache');

router.get('/holidays', async (req, res) => {
    const { country, year } = req.query;
    const cacheKey = `${country}-${year}`;

    if (!country || !year) {
        return res.status(400).json({
            message: "Bad Request: 'country' and 'year' query parameters are required."
        });
    }

    if (cache.has(cacheKey)) {
        return res.json(cache.get(cacheKey));
    }

    try {
        const holidays = await calendarificService.getHolidays(country, year);
        cache.set(cacheKey, holidays);
        res.json(holidays);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching holidays', error: error.message });
    }
});

module.exports = router;