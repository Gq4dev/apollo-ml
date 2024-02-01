const G = require("graphql");
const queries = require("./queries.js");

const rootQuery = new G.GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getUserInfo: queries.user,
  },
});

const privateSchema = new G.GraphQLSchema({
  query: rootQuery,
});

module.exports = {
  privateSchema
};
