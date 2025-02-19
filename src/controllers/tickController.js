const axios = require('axios');
const { fetchApiUsage } = require('../service/apiService');
const logger = require('../utils/logger');

const processTick = async (req, res) => {
  try {
    const { channel_id, return_url, settings } = req.body;

    logger.info('Received request body:', req.body);

    const apiEndpointSetting = settings.find((s) => s.label === 'API Endpoint');
    const rateLimitSetting = settings.find((s) => s.label === 'Rate Limit');

    const apiEndpoint = apiEndpointSetting?.default || null;
    const rateLimit = parseInt(rateLimitSetting?.default, 10) || null;

    if (!apiEndpoint) {
      return res.status(400).json({
        error: 'API Endpoint is required and must be valid.',
      });
    }

    if (!rateLimit || isNaN(rateLimit)) {
      return res.status(400).json({
        error: 'Rate Limit is required and must be a valid number.',
      });
    }

    logger.info(`API Endpoint: ${apiEndpoint}`);
    logger.info(`Rate Limit: ${rateLimit}`);

    let usage, limit;

    try {
      const usageData = await fetchApiUsage(apiEndpoint);
      usage = usageData.usage;
      limit = usageData.limit;

      if (!usage || !limit) {
        throw new Error('Invalid API response: Missing usage or limit data.');
      }

      logger.info('Fetched API usage:', { usage, limit });
    } catch (fetchError) {
      logger.error('Error fetching API usage:', {
        message: fetchError.message,
        response: fetchError.response?.data,
      });

      // Prepare fallback payload for rate limit error
      const fallbackPayload = {
        message: 'Failed to fetch API usage. Possible rate limit exceeded.',
        username: 'API Rate Limiter Monitor',
        event_name: 'API Rate Limit Check',
        status: 'error',
        details:
          fetchError.response?.data?.results?.message || fetchError.message,
      };

      try {
        const response = await axios.post(return_url, fallbackPayload);
        logger.info('Telex fallback response:', response.data);
      } catch (fallbackError) {
        logger.error('Failed to send fallback to Telex:', {
          message: fallbackError.message,
          response: fallbackError.response?.data,
        });
      }

      // Send error response back to the client
      return res.status(500).json({
        error: 'Failed to fetch API usage.',
        message: fetchError.message,
      });
    }

    const remaining = limit - usage;

    logger.info(`Remaining usage: ${remaining}`);

    const message =
      `API Usage: ${usage}/${limit}. Remaining: ${remaining}.` +
      (remaining < rateLimit * 0.1 ? ' Warning: Approaching rate limit!' : '');

    const payload = {
      message,
      username: 'API Rate Limiter Monitor',
      event_name: 'API Rate Limit Check',
      status: remaining < rateLimit * 0.1 ? 'error' : 'success',
    };

    logger.info('Prepared payload to send to Telex:', payload);

    const response = await axios.post(return_url, payload);
    logger.info('Telex response:', response.data);

    res.status(200).json({ message: 'Tick processed successfully.' });
  } catch (error) {
    logger.error('Error processing tick:', {
      stack: error.stack,
      message: error.message,
      response: error.response?.data,
    });

    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
};

module.exports = { processTick };
