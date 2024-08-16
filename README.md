# Holiday API

## Description

The Holiday API is a Node.js RESTful API for fetching and caching holiday data using the Calendarific API. It includes endpoints for retrieving holidays and country information.

## Requirements

- Node.js (v14 or higher)
- npm (v7 or higher)

## Setup

1. **Clone the Repository**

   ```bash
   https://github.com/AmmarMaq5ood/holidays-api.git
   cd holiday-api

2. **Run the following command to install all necessary dependencies:**
    npm install

3. **Environment Variables**
    Create a .env file in the root directory of the project and add your environment variables. For example: CALENDARIFIC_API_KEY=your_calendarific_api_key

4. **Start the Server**
    Use *npm run serve* to start the server with nodemon

5. **Endpoints**
    *GET* /api/holidays: Fetch holidays for a specific country and year.
    **Query Parameters**
        country (required): ISO 3166-1 alpha-2 or alpha-3 country code.
        year (required): 4-digit year.

        e.g. "http://localhost:3000/api/holidays?country=US&year=2024"

    *GET* /api/countries: Fetch a list of countries.
        e.g. "http://localhost:3000/api/countries"

6. **Testing**
    Run Tests

    Use **npm run test** to run the tests with Jest: And a coverage report will be saved in the coverage directory.
