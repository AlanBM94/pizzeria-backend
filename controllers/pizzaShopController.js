const PizzaShop = require("../models/pizzaShopModel");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");

module.exports.getPizzaShops = async (req, res, next) => {
  try {
    const shops = await PizzaShop.find();
    res.status(200).json({
      shops
    });
  } catch (error) {
    return next(new HttpError("Could not find pizza shops", 500));
  }
};

module.exports.getPizzaShopById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const pizzaShop = await PizzaShop.find({ shopId: id });
    res.status(200).json({
      pizzaShop
    });
  } catch (error) {
    return next(new HttpError("Could not find a pizza shop for that id", 500));
  }
};

module.exports.createPizzaShop = async (req, res, next) => {
  try {
    const newPizzaShop = await PizzaShop.create(req.body);
    res.status(201).json({
      newPizzaShop
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not create a pizza shop", 500));
  }
};
