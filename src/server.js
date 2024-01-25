import { ApolloServer } from "@apollo/server";
const types = require("./types/types");
const resolvers = require("./resolvers/queries");

import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";

const server = new ApolloServer({
  typeDefs: [types],
  resolvers: [resolvers],
});


export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
);
