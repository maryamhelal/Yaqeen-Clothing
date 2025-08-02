const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

router.post("/", tagController.createTag);
router.get("/", tagController.getTag);
router.get("/categories", tagController.getCategories);
router.get("/collections", tagController.getCollections);
router.delete("/", tagController.deleteTag);
router.post("/add-sale", tagController.addTagSale);

module.exports = router;
