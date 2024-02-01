const types = `
  type User {
    id: ID!
    nickname: String!
    site_id: String!
    user_type: String!
    # Add other relevant fields as needed
  }

  type Book {
    title: String
    author: String
  }
`;

module.exports = types
