const express = require("express");
const router = express.Router();

const login = require('../controller/login.controller')

router.use("/", login.index)

module.exports = router;