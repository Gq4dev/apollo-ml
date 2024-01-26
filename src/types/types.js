
const types = `
  type User {
    id: ID!
    nickname: String!
    site_id: String!
    # Add other relevant fields as needed
  }
  type Query {
    hello: String
  }

  extend type Query {
    getUserInfo(userId: String!): User
  }
`;

export default types;
