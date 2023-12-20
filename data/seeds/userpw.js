const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  // Hashed passwords
  const hash1 = bcrypt.hashSync('password1', 8); // Replace 'password1' with your desired password
  const hash2 = bcrypt.hashSync('password2', 8); // Replace 'password2' with your desired password

  // Insert users with hashed passwords
  await knex('users').insert([
    { username: 'joe', password: hash1 },
    { username: 'jane', password: hash2 },
  ]);
};
