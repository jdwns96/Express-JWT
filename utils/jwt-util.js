const jwt = require("jsonwebtoken");

const JWT_SECRET = "JWT";

const TOKEN_VERIFY = 0; // 로그인 상태
const TOKEN_EXPIRED = 1; // (기간 만료)로그인 상태 하지만 시간이 지나서 재발급이 필요함
const TOKEN_INVALID = 2; // (유효하지 않음)잘못된 토큰이거나 로그인 상태가 아님

const jwtUtil = {
  // access token Issuance
  accessSign(user) {
    const payload = {
      user_id: user.user_id,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "3s", // 30초
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
        _status: TOKEN_VERIFY,
        user_id: decoded.user_id,
        name: decoded.name,
      };
    } catch (e) {
      const { message } = e;
      if (message === "jwt expired") {
        return {
          _status: TOKEN_EXPIRED,
          message: "jwt expired",
        };
      }
      if (message === "invalid token") {
        return {
          _status: TOKEN_INVALID,
          message: "invalid token",
        };
      }
      return {
        _status: TOKEN_INVALID,
        message: "invalid token",
      };
    }
  },

  // refresh token Issuance
  refreshSign() {
    const payload = {};
    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "10s", // 14일 "14d"
    });
    return refreshToken;
  },

  refreshVerify(token) {
    let decoded = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      return {
        _status: TOKEN_VERIFY,
      };
    } catch (e) {
      const { message } = e;
      if (message === "jwt expired") {
        console.log("( refresh ) jwt expired");
        return {
          _status: TOKEN_EXPIRED,
          message: "( refresh ) jwt expired",
        };
      }
      if (message === "invalid token") {
        console.log("( refresh ) invalid token");
        return {
          _status: TOKEN_INVALID,
          message: "( refresh ) invalid token",
        };
      }
      console.log("( refresh ) invalid token");
      return {
        _status: TOKEN_INVALID,
        message: "( refresh ) invalid token",
      };
    }
  },
};

module.exports = jwtUtil;
