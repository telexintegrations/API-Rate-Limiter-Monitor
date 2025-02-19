const axios = require('axios');
const logger = require('../utils/logger');

const fetchApiUsage = async (apiEndpoint) => {
  try {
    logger.info(`Fetching API usage from: ${apiEndpoint}`);
    const response = await axios.get(apiEndpoint);

    // Check if the API response contains the expected data
    const { usage, limit } = response.data;
    if (typeof usage !== 'number' || typeof limit !== 'number') {
      throw new Error(
        `Invalid response format: usage=${usage}, limit=${limit}`
      );
    }

    return { usage, limit, headers: response.headers };
  } catch (error) {
    const status = error.response?.status;
    const errorData = error.response?.data;

    // Specific handling for "RateLimitExceeded" error
    if (status === 429 || errorData?.results?.code === 'RateLimitExceeded') {
      logger.error('Rate limit exceeded:', {
        message: errorData?.results?.message || error.message,
        documentation: errorData?.results?.documentation || 'N/A',
      });

      throw new Error(
        `Rate limit exceeded. Please try again later. Documentation: ${errorData?.results?.documentation}`
      );
    }

    // General error handling
    logger.error('Error fetching API usage:', {
      message: error.message,
      status,
      errorData,
      stack: error.stack,
    });

    throw new Error('Failed to fetch API usage');
  }
};

module.exports = { fetchApiUsage };
