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
`;

module.exports = types
