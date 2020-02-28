const express = require("express");
const pizzaShopController = require("../controllers/pizzaShopController");

const router = express.Router();

router.get("/shop/:id", pizzaShopController.getPizzaShopById);

router.get("/", pizzaShopController.getPizzaShops);

router.post("/", pizzaShopController.createPizzaShop);

module.exports = router;
