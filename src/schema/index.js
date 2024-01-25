import { graphql as G } from "graphql";

const rootQuery = new G.GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    sites: queries.sites,
  },
});


const privateSchema = new G.GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation,
    directives: [RateLimitDirective, upperFirst],
  });
  
  
  
  module.exports = {
    privateSchema,
  };
  