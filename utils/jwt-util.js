const jwt = require("jsonwebtoken");

/**
 * @token
 * user_id
 * name
 */

const JWT_SECRET = "JWT";

const jwtUtil = {
  // access token Issuance
  accessSign(user) {
    const payload = {
      user_id: user.user_id,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "10s", // 10초
    });
    return accessToken;
  },

  accessVerify(token) {
    let decoded = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      // 분기 걸어줘야함
      // success
      return {
        _isVerified: true,
        _status: "",
        user_id: decoded.user_id,
        name: decoded.name,
      };
    } catch (error) {
      console.log(error);
      return {
        _isVerified: false,
        _status: "",
        message: error.message,
      };
    }
  },

  // refresh token Issuance
  refreshSign() {
    const payload = {};
    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "14d", // 14일
    });
    return refreshToken;
  },

  refreshVerify(token) {
    let decoded = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      // 분기 걸어줘야함
      // 만료 시
      return {
        _isVerified: true,
        _status: "",
      };
    } catch (error) {
      console.log(error);
      return {
        _isVerified: false,
        _status: "",
        message: error.message,
      };
    }
  },
};

module.exports = jwt;
