const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");

router.post("/", messageController.createMessage);

router.get("/", /* authMiddleware, */ messageController.getAllMessages);

router.get("/:userEmail", messageController.getUserMessages);

module.exports = router;
