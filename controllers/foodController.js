const Food = require("../models/foodModel");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

module.exports.findFood = async (req, res, next) => {
  const categorySelected = req.params.category;
  let foods;
  try {
    foods = await Food.find({ category: categorySelected });
  } catch (error) {
    return next(
      new HttpError("Could not find any food, please try again later", 500)
    );
  }

  res.status(200).json({
    foods: foods
  });
};

module.exports.validateFoodBody = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  } else {
    return next();
  }
};

const checkIfFoodAlreadyExists = async (title, next) => {
  let existingFood;
  try {
    existingFood = await Food.findOne({ title });
  } catch (error) {
    return next(
      new HttpError("Could not create a food, please try againg later", 500)
    );
  }
  if (existingFood) {
    return next(new HttpError("Food title has to be unique", 422));
  }
};

module.exports.createFood = async (req, res, next) => {
  const { title, description, category, image } = req.body;
  await checkIfFoodAlreadyExists(title, next);

  const newFood = new Food({
    title,
    description,
    category,
    image
  });

  try {
    await newFood.save();
  } catch (error) {
    return next(
      new HttpError("Could not create a new food, please try again later", 500)
    );
  }
  res.status(201).json({
    food: newFood
  });
};
