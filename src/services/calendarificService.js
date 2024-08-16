const axios = require('axios');
const config = require('../config/config');

const getHolidays = async (country, year) => {
    const url = `${config.apiUrl}/holidays?api_key=${config.apiKey}&country=${country}&year=${year}`;
    const response = await axios.get(url);
    return response.data.response.holidays;
};

const getCountries = async () => {
    const url = `${config.apiUrl}/countries?api_key=${config.apiKey}`;
    const response = await axios.get(url);
    return response.data.response.countries;
};

module.exports = {
    getHolidays,
    getCountries,
};