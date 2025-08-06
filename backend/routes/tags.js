const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

router.post("/", tagController.createTag);
router.get("/name/:name", tagController.getTag);
router.get("/categories", tagController.getCategories);
router.get("/collections", tagController.getCollections);
router.delete("/name/:name", tagController.deleteTag);
router.post("/add-sale", tagController.addTagSale);

module.exports = router;
