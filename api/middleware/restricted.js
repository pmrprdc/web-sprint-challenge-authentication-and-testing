const jwt = require('jsonwebtoken');
const secret = process.env.secret || "shh"
module.exports = (req, res, next) => {
  
  // Retrieve the token from the Authorization header
  const token = req.headers.authorization;
  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: "token required" });
  }else{
    jwt.verify(token, secret ,(error,decoded)=>{
      if(error){
        console.error("Token verification error:", error);
        res.status(401).json({message: "your token is invalid or expired"})
      }else {
        req.decodedjwt = decoded;
        console.log(`jwt verify has worked on to resources${decoded}`)
        next();
      }
    } )
  }
  //CHECK IF TOKEN IS VALID
  console.log(token)


};
