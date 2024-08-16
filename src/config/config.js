require('dotenv').config();

module.exports = {
    apiKey: process.env.CALENDARIFIC_API_KEY,
    apiUrl: 'https://calendarific.com/api/v2',
    cacheTTL: process.env.CACHE_TTL || 86400,
};
