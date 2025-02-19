

# API Rate Limiter Monitor

The **API Rate Limiter Monitor** is a Node.js application built using Express.js. It is designed to monitor API usage, track it against defined rate limits, and send status notifications to the Telex platform.


## Features

- Fetches API usage details from an endpoint.
- Monitors rate limits and calculates remaining usage.
- Sends alerts to Telex when usage approaches or exceeds limits.
- Handles error scenarios such as rate limit exhaustion or invalid API responses.


## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for dependency management
- A valid API endpoint and API key
- Telex platform setup for receiving notifications


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/api-rate-limiter-monitor.git
   ```

2. Navigate to the project directory:
   ```bash
   cd api-rate-limiter-monitor
   ```

3. Install dependencies:
   ```bash
   npm install
   ```


## Configuration

1. Update the `integration.json` file located in the `src/config/` folder with the appropriate settings, such as API endpoint, API key, and rate limit.

2. Ensure the structure follows this format:
   ```json
   {
     "settings": [
       {
         "label": "API Endpoint",
         "default": "https://example.com/api/usage"
       },
       {
         "label": "API Key",
         "default": "your-api-key"
       },
       {
         "label": "Rate Limit",
         "default": 1000
       }
     ]
   }
   ```


## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. The server will be available at `http://localhost:3000` by default.

3. To test the application:
   - Use tools like [Postman](https://www.postman.com/) or [curl](https://curl.se/) to send a POST request to the `/process-tick` endpoint.
   - Example request body:
     ```json
     {
       "channel_id": "your-channel-id",
       "return_url": "https://telex.example.com/webhook",
       "settings": [
         {
           "label": "API Endpoint",
           "default": "https://example.com/api/usage"
         },
         {
           "label": "Rate Limit",
           "default": 1000
         }
       ]
     }
     ```


## Project Structure

```
src/
├── config/
│   └── integration.json      # Configuration settings
├── controllers/
│   └── tickController.js     # Main logic for processing ticks
├── routes/
│   └── routes.js             # API route definitions
├── service/
│   └── apiService.js         # Service to fetch API usage details
├── utils/
│   └── logger.js             # Logging utility
├── app.js                    # Express app setup
├── server.js                 # Server initialization
```


## Error Handling

- **Missing API Endpoint or Rate Limit**: Returns a 400 status code with an appropriate error message.
- **Rate Limit Exceeded**: Logs an error and notifies Telex.
- **Invalid API Response**: Handles missing or malformed data gracefully and logs errors for debugging.
- **Server Errors**: Returns a 500 status code for unexpected issues.


## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

```
# API-Rate-Limiter-Monitor
# API-Rate-Limiter-Monitor
