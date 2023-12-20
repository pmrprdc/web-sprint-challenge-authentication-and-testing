const db = require('../../data/dbConfig'); // Adjust the path to where your db-config is

// Helper function to find a user by a filter (e.g., username)
async function findBy(filter) {
  const users = await db('users').where(filter).first();
  return users;
}

// Helper function to add a new user
async function add(user) {
  const [id] = await db('users').insert(user);
  return await findById(id);
}

// Helper function to find a user by ID
async function findById(id) {
  return await db('users').where({ id }).first();
}

// Export the helper functions
module.exports = {
  findBy,
  add,
  findById,
  // You can add other exported functions here
};
