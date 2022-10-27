const jwt = require("jsonwebtoken");
const { accessVerify } = require("../utils/jwt-util");

// api 접근 권한이 있는지 확인하는 미들웨어
// accessToken 권한 체크
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
  if (result._status === 1) {
    return res.status(419).json({
      message: "token is expired",
    });
  }
  // 검증 불가
  if (result._status === 2) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  // 검증 완료
  req.user_id = result.user_id;
  req.name = result.name;
  next();
};
module.exports = authMiddleware;
