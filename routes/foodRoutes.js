const express = require("express");
const foodController = require("../controllers/foodController");
const { check } = require("express-validator");
const fileUpload = require("../middleware/fileUpload");
const validation = require("../middleware/validateBody");

const route = express.Router();

route.get("/:category", foodController.findFood);

route.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").isLength({ min: 10, max: 30 }),

    check("description").isLength({ min: 20, max: 100 }),

    check("category")
      .not()
      .isEmpty()
  ],
  validation.validateBody,
  foodController.createFood
);

module.exports = route;
