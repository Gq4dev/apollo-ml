const types = require("../types/objects.js");
const resolvers = require('../resolvers/queries.js')

const user = {
  type: types.User,
  resolve: resolvers.getUserInfo
};

module.exports = {user};
