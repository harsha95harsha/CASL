const jwt = require('jsonwebtoken');
const secretKey = process.env.ACCESS_TOKEN_SECRET


async function authenticate(req, res, next) {

    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
  
    if (!token) {
      return res
        .status(401)
        .json({ statusCode: 401, error: "Token not provided" });
    }
    try {
      
        const decodedAccessToken = jwt.verify(token, secretKey);
        console.log(decodedAccessToken);
        req.user = decodedAccessToken;
        next();
      
    } catch (error) {
      return res
        .status(403)
        .json({ statusCode: 403, error: "Failed to authenticate token" });
    }
}

module.exports = { authenticate };
