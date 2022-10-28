const express = require("express");

const auth = require("./auth");
const test = require("./test");

const router = express.Router();

router.use(auth);
router.use(test);

module.exports = router;
