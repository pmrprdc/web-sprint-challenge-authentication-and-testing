// users-model.js
const db = require('../../data/dbConfig'); // Adjust the path to where your db-config is

const Users = {
  // Method to find a user by a filter (e.g., username)
  findBy(filter) {
    return db('users').where(filter);
  },

  // Method to add a new user
  async add(user) {
    const [id] = await db('users').insert(user);
    return Users.findById(id);
  },

  // Method to find a user by ID
  findById(id) {
    return db('users').where({ id }).first();
  },

  // Add other necessary methods here
};

module.exports = Users;
