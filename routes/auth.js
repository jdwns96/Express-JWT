const express = require("express");
const bcrypt = require("bcrypt");

const {
  accessSign,
  accessVerify,
  refreshSign,
  refreshVerify,
} = require("../utils/jwt-util");

const userTable = require("../db/user");

const router = express.Router();

// @ 로그인, 엑세스 토큰, 리프레시 토큰 발급 후 전달
router.post("/login", async (req, res) => {
  const { user_id, password } = req.body;

  const value = userTable.find(
    (elem, index) => elem.user_id === user_id && elem.password === password
  );
  if (!value) {
    return res.status(403).json({
      massage: "the ID or password does not correspond.",
    });
  }

  const accessToken = accessSign(value);
  const refreshToken = refreshSign();

  return res.status(200).json({
    token: {
      accessToken: `bearer ${accessToken}`,
      refreshToken,
    },
    user: {
      id: value.id,
      user_id: value.user_id,
      name: value.name,
    },
  });
});

// @ 새로고침 검사 및 로그인 상태 확인
router.get("/login-check", (req, res) => {
  // refresh 토큰을 활용해서 access token 재발급을 허용할지 말지 선택한다.
  // 로그인 상태 검증 & 새로고침
  const { refresh } = req.headers;

  // if there is no refresh value in req.headers
  if (!refresh) {
    return res.status(403).json({
      message: "access denied",
    });
  }
  // check refresh-token
  const result = refreshVerify(refresh);

  if (result._status === 0) {
    const exUser = userTable.find((v, i) => v.refresh_token === refresh);
    // if there is no refresh_token in db, get logout
    if (!exUser) {
      return res.status(403).json({
        message: "access denied",
      });
    }

    // success
    const accessToken = accessSign(exUser);
    return res.status(200).json({
      token: {
        accessToken: `bearer ${accessToken}`,
        refreshToken: refresh,
      },
      user: {
        id: exUser.id,
        user_id: exUser.user_id,
        name: exUser.name,
      },
    });
  }

  // 실패, 기간 만료!! , 리프레시 재발급 혹은 로그아웃
  if (result._status === 1) {
    const exUser = userTable.find((v, i) => v.refresh_token === refresh);
    if (!exUser) {
      return res.status(403).json({
        message: "access denied",
      });
    }

    const accessToken = accessSign(exUser);
    const refreshToken = refreshSign();

    return res.status(200).json({
      token: {
        accessToken: `bearer ${accessToken}`,
        refreshToken: refreshToken,
      },
      user: {
        id: exUser.id,
        user_id: exUser.user_id,
        name: exUser.name,
      },
    });
  }
  // 실패, 유효하지 않음, 로그아웃
  if (result._status === 2) {
    return res.status(403).json({
      message: "access denied",
    });
  }

  return res.status(403).json({
    message: "access denied",
  });
});

router.get("/logout", (req, res) => {
  // 그냥 로그인 하세요
});

module.exports = router;
