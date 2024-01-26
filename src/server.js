import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { defaultKeyGenerator, rateLimitDirective } from 'graphql-rate-limit-directive';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import resolvers from './resolvers/index.js'
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";

// This is not necessary, it exists to demonstrate when we check the rate limit usage
class DebugRateLimiterMemory extends RateLimiterMemory {
  consume(key, pointsToConsume, options) {
    console.log(`[CONSUME] ${key} for ${pointsToConsume}`);
    return super.consume(key, pointsToConsume, options);
  }
}

// IMPORTANT: Specify how a rate limited field should determine uniqueness/isolation of operations
// Uses the combination of user specific data (their ip) along the type and field being accessed
const keyGenerator = (directiveArgs, source, args, context, info) =>
  `${context.ip}:${defaultKeyGenerator(directiveArgs, source, args, context, info)}`;

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } = rateLimitDirective({
  keyGenerator,
  limiterClass: DebugRateLimiterMemory
});


let schema = makeExecutableSchema({
  typeDefs: [
    rateLimitDirectiveTypeDefs,
    `# Allow each field to be queried once every 15 seconds
   
    type Query @rateLimit(limit: 10, duration: 15) {
      books: [Book!]
      quote: String
      getUserInfo(userId: String!): User
    }
    type User {
      id: ID!
      nickname: String!
      site_id: String!
    }
     
    type Book {
      title: String
      author: String
    }`,
  ],
  resolvers,
});
schema = rateLimitDirectiveTransformer(schema);

const app = express();
app.use(
  '/graphql',
  graphqlHTTP((request) => {
    console.log(request.ip)
    return {
      schema,
      // IMPORTANT: Build GraphQL context from request data (like userId and/or ip)
      context: {
        // See https://expressjs.com/en/api.html#req.ip
        ip: request.ip, // Express uses IPv6 by default
      },
      graphiql: {
        defaultQuery: `# Welcome to GraphiQL
#
# Allow each field to be queried once every 15 seconds.
# Repeated requests within this time window will fail.

query {
  quote
  books {
    title
    author
  }
}`
      },
    };
  }),
);
// app.listen(4000, () => {
//   console.log(`🚀  Server ready at http://localhost:4000/graphql`);
// });


export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler()
);