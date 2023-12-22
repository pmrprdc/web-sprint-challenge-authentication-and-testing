const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Retrieve the token from the Authorization header
  const token = req.headers.authorization;

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: "token required" });
  }

  // Verify the token
  try {
    // Replace 'process.env.JWT_SECRET' with your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    req.user = decoded; // Optional: Add the decoded token to the request if you want to use it later

    next(); // Token is valid, proceed to the next middleware
  } catch (err) {
    // Token is invalid or expired
    return res.status(401).json({ message: "token invalid" });
  }
};
