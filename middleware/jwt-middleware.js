const jwt = require("jsonwebtoken");
// module.exports =

const jwtMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  // access denied
  if (!authorization) {
    return res.status(403).json({
      message: "",
    });
  }
};

module.exports = jwtMiddleware;
