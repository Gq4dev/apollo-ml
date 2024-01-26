import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import types from "./types/types.js";
import resolvers from "./resolvers/index.js";
import { makeExecutableSchema } from '@graphql-tools/schema';

// Deploy serverless
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";

// Rate Limiter
import {
  rateLimitDirective,
  defaultKeyGenerator,
} from "graphql-rate-limit-directive";
import { RateLimiterMemory } from "rate-limiter-flexible";

class DebugRateLimiterMemory extends RateLimiterMemory {
  consume(key, pointsToConsume, options) {
    console.log(`[CONSUME] ${key} for ${pointsToConsume}`);
    return super.consume(key, pointsToConsume, options);
  }
}

// IMPORTANT: Specify how a rate limited field should determine uniqueness/isolation of operations
// Uses the combination of user specific data (their ip) along the type and field being accessed
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
    limiterClass: DebugRateLimiterMemory,
  });

let schema = makeExecutableSchema({
  typeDefs: [rateLimitDirectiveTypeDefs, types],
  resolvers,
});

schema = rateLimitDirectiveTransformer(schema);

const server = new ApolloServer({
  schema,
});

// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
// });

// console.log(`🚀  Server ready at: ${url}`);

// This final export is important!

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler()
);
