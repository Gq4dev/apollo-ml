// userResolvers.js
const axios = require("axios");

const MERCADOLIBRE_API_URL = "https://api.mercadolibre.com";

const queries = {
  Query: {
    getUserInfo: async (_, { userId }) => {
      try {
        // Make a request to MercadoLibre API to get user information
        const response = await axios.get(
          `${MERCADOLIBRE_API_URL}/users/${userId}`
        );

        // Extract relevant user information from the API response
        const { id, nickname, email } = response.data;

        // Return the user information
        return {
          id,
          nickname,
          email,
          // Add other relevant fields as needed
        };
      } catch (error) {
        // Handle errors, for example, log the error and return null
        console.error("Error fetching user information:", error.message);
        return null;
      }
    },
  },
};

module.exports = queries;
