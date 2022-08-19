const express = require("express");
const { getOldIamUser } = require("../controller/iamController");
const router = express.Router();

router.get("/", getOldIamUser)

module.exports = router;