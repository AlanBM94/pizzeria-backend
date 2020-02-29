const express = require("express");
const pizzaShopController = require("../controllers/pizzaShopController");
const { check } = require("express-validator");
const validation = require("../middleware/validateBody");

const router = express.Router();

router.get("/shop/:id", pizzaShopController.getPizzaShopById);

router.get(
  "/",
  [
    check("shoId")
      .not()
      .isEmpty(),

    check("address")
      .not()
      .isEmpty()
  ],
  pizzaShopController.getPizzaShops
);

router.post("/", validation.validateBody, pizzaShopController.createPizzaShop);

module.exports = router;
