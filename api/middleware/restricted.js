const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  
  // Retrieve the token from the Authorization header
  const token = req.headers.authorization;
  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: "token required" });
  }else{
    jwt.verify(token,process.env.JWT_SECRET,(error,decoded)=>{
      if(error){
        res.status(401).json({message: "your token is invalid or expired"})
      }else {
        req.decodedjwt = decoded;
        next();
      }
    } )
  }
  //CHECK IF TOKEN IS VALID
  console.log(token)


};
