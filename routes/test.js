const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/test", auth, (req, res) => {
  const { id, user_id, name } = req.user;
  console.log(id, user_id, name);
  return res.status(200).json({
    message: "success",
  });
});

module.exports = router;
