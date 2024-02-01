const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { printType, G, printSchema } = require("graphql");
// const types = require("./types/types");
const queries = require("./types/queries");
const resolvers = require("./resolvers/resolvers");
const typesObjects = require("./types/typeObjects");
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

const sdlStrings = typesObjects.map((type) => printType(type));
const combinedSDL = sdlStrings.join("\n\n");

// const sdlResolvers = resolvers.map((resolver) => printType(resolver));
// const resolversSDL = sdlResolvers.join("\n\n");

console.log(combinedSDL);

const schema = makeExecutableSchema({
  typeDefs: [combinedSDL, queries, rateLimitDirectiveTypeDefs],
  resolvers: [resolvers],
});

const schemaM = rateLimitDirectiveTransformer(schema);

const server = new ApolloServer({
  schema: schemaM,
});

async function runServer() {
  const { url } = await startStandaloneServer(server);
  console.log(`Server running at ${url}`);
}

runServer().catch((error) => console.error(error));
// This final export is important!

// Define the GraphQL handler for AWS Lambda
// const graphqlHandler = startServerAndCreateLambdaHandler(
//   server,
//   handlers.createAPIGatewayProxyEventV2RequestHandler()
// );

// // Export the GraphQL handler
// module.exports = { graphqlHandler };
