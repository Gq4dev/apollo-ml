import { ApolloServer } from "@apollo/server";
import types from "./types/types.js";
import resolvers from "./resolvers/index.js";
import { startStandaloneServer } from "@apollo/server/standalone";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  defaultKeyGenerator,
  rateLimitDirective,
} from "graphql-rate-limit-directive";

const keyGenerator = (directiveArgs, source, args, context, info) =>
  `${context.ip}:${defaultKeyGenerator(
    directiveArgs,
    source,
    args,
    context,
    info
  )}`;

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } =
  rateLimitDirective({
    keyGenerator,
  });

let schema = makeExecutableSchema({
  typeDefs: [types, rateLimitDirectiveTypeDefs],
  resolvers: resolvers,
});

schema = rateLimitDirectiveTransformer(schema);

const server = new ApolloServer({
  schema,
});

// // This final export is important!

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler()
);
