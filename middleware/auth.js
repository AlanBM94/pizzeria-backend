const HttpError = require("../models/http-error");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }

  if (!token) {
    return next(
      new HttpError("You are not logged in! Please log in to get access.", 401)
    );
  }
  let decoded;

  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY);
  } catch (error) {
    return next(new HttpError("There is a problem with your token", 500));
  }

  let currentUser;

  try {
    currentUser = await User.findOne({ email: decoded.email });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not find a user with that id", 500));
  }

  if (!currentUser) {
    return next(
      new HttpError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;
  next();
};
