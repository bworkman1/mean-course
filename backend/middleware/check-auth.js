const jwt = require('jsonwebtoken');

const config = require('../config.json');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, config.jwt_signature);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({message: "You are not authenticated"});
  }
};
