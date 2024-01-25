const { gql } = require("apollo-server");

const types = gql`
  type User {
    id: ID!
    nickname: String!
    email: String!
    # Add other relevant fields as needed
  }

  extend type Query {
    getUserInfo(userId: String!): User
  }
`;

module.exports = types;
