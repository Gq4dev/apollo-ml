const G = require("graphql");

const User = new G.GraphQLObjectType({
  name: "User",
  fields: {
    id: {
      type: G.GraphQLID,
    },
    nickname: {
      type: G.GraphQLString,
    },
    site_id: {
      type: G.GraphQLString,
      astNode: {
        directives: [
          {
            kind: "Directive",
            name: {
              kind: "Name",
              value: "rateLimit", // Fix the directive name
            },
            arguments: [
              {
                kind: "Argument",
                name: {
                  kind: "Name",
                  value: "limit",
                },
                value: {
                  kind: "IntValue", // Fix the kind to "IntValue"
                  value: 2,
                },
              },{
                kind: "Argument",
                name: {
                  kind: "Name",
                  value: "duration",
                },
                value: {
                  kind: "IntValue", // Fix the kind to "IntValue"
                  value: 15,
                },
              },
            ],
          },
        ],
      },
    },
  },
});

// const types = `
//   type User {
//     id: ID!
//     nickname: String!
//     site_id: String!
//     # Add other relevant fields as needed
//   }

//   type Book {
//     title: String
//     author: String
//   }

//   type Query @rateLimit(limit: 10, duration: 15) {
//     hello: String
//     books: [Book!]
//     quote: String
//     getUserInfo(userId: String!): User
//   }

// `;

module.exports =  {User} ;
