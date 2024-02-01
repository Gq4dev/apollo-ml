const axios = require("axios");
const MERCADOLIBRE_API_URL = "https://api.mercadolibre.com"; // Replace with your actual API URL

const resolvers = {
  Query: {
    async getUserInfo(_, { userId }) {
      console.log("Entre", userId);
      try {
        // Make a request to MercadoLibre API to get user information
        const response = await axios.get(
          `${MERCADOLIBRE_API_URL}/users/${userId}`
        );

        // Extract relevant user information from the API response
        const { id, nickname, site_id } = response.data;

        // Return the user information
        return {
          id,
          nickname,
          site_id,
          // Add other relevant fields as needed
        };
      } catch (error) {
        // Handle errors, for example, log the error and return null
        console.error("Error fetching user information:", error.message);
        return null;
      }
    },
    async getUserData(parent, { userId }, context, info) {
      try {
        // Make a request to MercadoLibre API to get user information
        const response = await axios.get(
          `${MERCADOLIBRE_API_URL}/users/${userId}`
        );

        // Extract relevant user information from the API response
        const { id, nickname, user_type } = response.data;

        // Return the user information
        return {
          id,
          nickname,
          user_type,
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

module.exports = resolvers;
