const NodeCache = require('node-cache');
const config = require('./config/config');

const cache = new NodeCache({ stdTTL: config.cacheTTL });

module.exports = cache;