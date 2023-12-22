const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const hash1 = bcrypt.hashSync('password1', 8); // Replace 'password1' with your desired password
  const hash2 = bcrypt.hashSync('password2', 8);
  // Deletes ALL existing entries
  await knex('users').truncate().then(
    function() {
      return knex('users').insert([
        { username: 'joe', password: hash1 },
        { username: 'jane', password: hash2 },
      ])
    }
  )

};
