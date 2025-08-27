const express = require("express");
const router = express.Router();
const workSpaceController = require("../controllers/workSpaceController");

router.post("/", workSpaceController.deployWorkspace);
router.delete("/", workSpaceController.stopWorkSpace);
router.post("/start", workSpaceController.startWorkSpace);
router.post("/redeploy", workSpaceController.reDeploy);

module.exports = router;
