const express = require("express");
const {
  accessSign,
  accessVerify,
  refreshSign,
  refreshVerify,
} = require("../utils/jwt-util");

const userTable = require("../db/user");

// refresh 토큰을 활용해서 access token 재발급을 허용할지 말지 선택한다.
app.get("/verify", (req, res) => {
  // 로그인 상태 검증 & 새로고침
  const { refresh } = req.headers;

  if (!refresh) {
    return res.status(403).json({
      message: "access denied",
    });
  }
  // check refresh-token
  const result = refreshVerify(refresh);

  // 실패, 기간 만료 , 리프레시 재발급 혹은 로그아웃
  if (result._status === 1) {
    return res.status(403).json({
      message: "refresh token timeout",
    });
  }
  // 실패, 유효하지 않음, 로그아웃
  if (result._status === 2) {
    return res.status(403).json({
      message: "access denied",
    });
  }

  const exUser = userTable.find((elem, i) => elem.refresh_token === refresh);
  // if there is no refresh_token in db, get logout
  if (!exUser) {
    return res.status(403).json({
      message: "access denied",
    });
  }

  // success
  const accessToken = accessSign(exUser);
  return res.status(201).json({
    accessToken: `bearer ${accessToken}`,
  });
});

app.get("");
