const jwt = require("jsonwebtoken");

const JWT_SECRET = "JWT";

/**
 * @token
 * user_id
 * name
 */

/**
 * @verify
 * 검증 성공 - 0 - 로그인 상태
 * 검증 실패 - 1 - (기간 만료)로그인 상태 하지만 시간이 지나서 재발급이 필요함
 * 검증 실패 - 2 - (유효하지 않음)잘못된 토큰이거나 로그인 상태가 아님
 */

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
        _status: 0,
        user_id: decoded.user_id,
        name: decoded.name,
      };
    } catch (e) {
      console.log(e);
      return {
        _status: 1,
        message: e.message,
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
        _status: 0,
      };
    } catch (e) {
      console.log(e);
      return {
        _status: 1,
        message: e.message,
      };
    }
  },
};

module.exports = jwtUtil;
