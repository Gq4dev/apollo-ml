const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { User } = require("./types/objects.js");
const { resolvers, Query } = require("./resolvers/queries.js");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { printType, G } = require("graphql");
const schema = require("./schema");

// Deploy serverless
const {
  startServerAndCreateLambdaHandler,
  handlers,
} = require("@as-integrations/aws-lambda");

// Rate Limiter
const {
  rateLimitDirective,
  defaultKeyGenerator,
} = require("graphql-rate-limit-directive");
const { RateLimiterMemory } = require("rate-limiter-flexible");

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

const schemaM = rateLimitDirectiveTransformer(schema.privateSchema);

const server = new ApolloServer({
  schema: schemaM,
});

const { url } = startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);

// This final export is important!

// export const graphqlHandler = startServerAndCreateLambdaHandler(
//   server,
//   // We will be using the Proxy V2 handler
//   handlers.createAPIGatewayProxyEventV2RequestHandler()
// );
