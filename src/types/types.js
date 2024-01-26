
const types = `
  type User {
    id: ID!
    nickname: String!
    site_id: String!
    # Add other relevant fields as needed
  }

  type Book {
    title: String
    author: String
  }

  type Query @rateLimit(limit: 10, duration: 15) {
    hello: String
    books: [Book!]
    quote: String
    getUserInfo(userId: String!): User
  }

`;

export default types;
