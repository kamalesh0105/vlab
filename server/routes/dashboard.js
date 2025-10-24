const express = require("express");
const router = express.Router();
const workSpaceController = require("../controllers/workSpaceController");

// Workspace management routes
router.post("/", workSpaceController.deployWorkspace);
router.delete("/", workSpaceController.stopWorkSpace);
router.post("/start", workSpaceController.startWorkSpace);
router.post("/redeploy", workSpaceController.reDeploy);

// Status and info routes
router.get("/status", workSpaceController.getStatus);
router.get("/stream", workSpaceController.getStream);
router.get("/me", workSpaceController.getMe);

module.exports = router;
