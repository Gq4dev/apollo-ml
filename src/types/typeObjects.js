const G = require("graphql");

const User = new G.GraphQLObjectType({
  name: "User",
  fields: {
    id: {
      type: G.GraphQLID,
    },
    site_id: {
      type: G.GraphQLString,
    },
    nickname: {
      type: G.GraphQLString,
    },
  },
});

const Data = new G.GraphQLObjectType({
  name: "Data",
  fields: {
    id: {
      type: G.GraphQLID,
    },
    nickname: {
      type: G.GraphQLString,
    },
    user_type: {
      type: G.GraphQLString,
    },
  },
});


module.exports = [User, Data];
