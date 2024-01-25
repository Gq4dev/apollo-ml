// userResolvers.js
import axios from "axios";

const MERCADOLIBRE_API_URL = "https://api.mercadolibre.com";

const resolvers = {
  Query: {
    getUserInfo: async (_, { userId }) => {
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
    hello: () => "world",
  },
};

export default resolvers;
