import { ApolloServer } from "@apollo/server";
import types from "./types/types.js";
import resolvers from "./resolvers/index.js";

import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";

// const resolvers = {
//   Query: {
//     hello: () => "world",
//   },
// };

const server = new ApolloServer({
  typeDefs: types,
  resolvers: resolvers,
});

// This final export is important!

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler()
);
