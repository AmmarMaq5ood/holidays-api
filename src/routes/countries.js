const express = require('express');
const calendarificService = require('../services/calendarificService');
const NodeCache = require('node-cache');

const router = express.Router();
const cache = new NodeCache();

router.get('/countries', async (req, res) => {
    const cacheKey = 'countries';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        const countries = await calendarificService.getCountries();
        cache.set(cacheKey, countries);
        res.json(countries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching countries', error: error.message });
    }
});

module.exports = router;