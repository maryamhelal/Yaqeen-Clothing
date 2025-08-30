const express = require("express");
const router = express.Router();
const promocodeController = require("../controllers/promocodeController");
const { auth } = require("../middleware/auth");

router.post("/preview", promocodeController.previewPromocode);

router.post("/", auth, promocodeController.createPromocode);
router.get("/", auth, promocodeController.getPromocodes);
router.put("/:id", auth, promocodeController.updatePromocode);
router.delete("/:id", auth, promocodeController.deletePromocode);

module.exports = router;
