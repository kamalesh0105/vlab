const express = require("express");
const router = express.Router();
const workSpaceController = require("../controllers/workSpaceController");

router.post("/", workSpaceController.deployWorkspace);

module.exports = router;
