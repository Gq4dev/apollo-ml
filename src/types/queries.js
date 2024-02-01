const queries = `
type Query {
    getUserInfo(userId: String!): User @rateLimit(limit: 5, duration: 15) 
    getUserData(userId: String!): Data
  }
  
`;

module.exports = queries;
