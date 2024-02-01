const queries = `
type Query @rateLimit(limit: 5, duration: 15) {
    hello: String
    books: [Book!]
    quote: String
    getUserInfo(userId: String!): User
  }
`;

module.exports = queries;
