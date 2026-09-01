const express = require("express");
const router = express.Router();

const { handleGetConstants } = require("../controllers/constant.controller");

// Get all constants
router.get("/", handleGetConstants);

module.exports = router;
