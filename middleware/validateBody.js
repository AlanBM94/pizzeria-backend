const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

module.exports.validateBody = (req, res, next) => {
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
