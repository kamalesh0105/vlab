const express = require("express");
const router = express.Router();
const workSpaceController = require("../controllers/workSpaceController");

router.get("/", workSpaceController.deployWorkspace);

module.exports = router;
