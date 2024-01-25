const types = `#graphql

  type User {
    id: ID!  
    nickname: String! 
    site_id: String! 
  }

  type Query @rateLimit(limit: 5, duration: 30){
    hello: String 
    feed : Feed! 
    getUserInfo(userId: String!): User 
  }

  type Feed {
    id: ID!
    count: Int!
  }

`;

export default types;
