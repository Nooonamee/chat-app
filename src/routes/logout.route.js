const express = require("express");
const router = express.Router();

const logout = require('../controller/logout.controller')

router.use("/", logout.index)

module.exports = router;