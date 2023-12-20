// users-model.js
const db = require('../../data/dbConfig'); // Adjust the path to where your db-config is

// Helper function to find a user by a filter (e.g., username)
function findBy(filter) {
  return db('users').where(filter);
}

// Helper function to add a new user
async function add(user) {
  const [id] = await db('users').insert(user);
  return findById(id);
}

// Helper function to find a user by ID
function findById(id) {
  return db('users').where({ id }).first();
}

// Export the helper functions
module.exports = {
  findBy,
  add,
  findById,
  // You can add other exported functions here
};
