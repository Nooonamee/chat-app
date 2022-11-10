const express = require("express");
const router = express.Router();

const signup = require('../controller/signup.controller')

router.use("/", signup.index)

module.exports = router;