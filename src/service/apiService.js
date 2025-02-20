const axios = require('axios');

const fetchApiUsage = async (endpoint) => {
  try {
    const response = await axios.get(endpoint);

    console.log('Full Response Headers:', response.headers);

    const limit = parseInt(response.headers['x_rate_limit_limit'], 10) || 1000;
    const remaining =
      parseInt(response.headers['x_rate_limit_remaining'], 10) || limit;

    const usage = limit - remaining; // Calculate usage from remaining

    return { usage, limit };
  } catch (error) {
    console.error('Error fetching API usage:', error.message);
    throw new Error('Failed to fetch API usage');
  }
};

module.exports = { fetchApiUsage };
