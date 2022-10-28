const jwt = require("jsonwebtoken");
const { accessVerify } = require("../utils/jwt-util");

// api 접근 권한이 있는지 확인하는 미들웨어
// accessToken 권한 체크

const TOKEN_VERIFY = 0; // 로그인 상태
const TOKEN_EXPIRED = 1; // (기간 만료)로그인 상태 하지만 시간이 지나서 재발급이 필요함
const TOKEN_INVALID = 2; // (유효하지 않음)잘못된 토큰이거나 로그인 상태가 아님

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  // 헤더에 코드 자체가 없는경우 -> 로그인 상태가 아님
  if (!authorization) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const token = authorization.split(" ")[1];
  const result = accessVerify(token); // 검증

  // 기간 만료
  if (result._status === TOKEN_EXPIRED) {
    console.log("access Token expired  (middleware)");
    return res.status(419).json({
      message: "token is expired (middleware)",
    });
  }
  // 검증 불가
  if (result._status === TOKEN_INVALID) {
    console.log("access Token invalid  (middle ware)");
    return res.status(403).json({
      message: "Forbidden (middle ware)",
    });
  }
  // 검증 완료
  req.user = {
    user_id: result.user_id,
    name: result.name,
  };

  next();
};
module.exports = authMiddleware;
