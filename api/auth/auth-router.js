const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../auth/users-model'); // Adjust the path for your users model

// Helper function to generate token
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = { expiresIn: '1d' };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  try {
    const userExists = await Users.findBy({ username }).first();
    if (userExists) {
      return res.status(409).json({ message: "username taken" });
    }

    const hash = bcrypt.hashSync(password, 8); // 2^8 rounds of hashing
    const newUser = await Users.add({ username, password: hash });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error registering new user" });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  try {
    const user = await Users.findBy({ username }).first();
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ message: `welcome, ${user.username}`, token });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
