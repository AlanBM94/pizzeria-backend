const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");

const checkIfUserAlreadyExists = async (email, next) => {
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later", 500)
    );
  }

  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead", 422)
    );
  }
};

const createAndSendToken = (newUser, statusCode, req, res, next) => {
  let token;

  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https"
    });

    newUser.password = undefined;

    res.status(statusCode).json({
      token,
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email
    });
  } catch (error) {
    return next(new HttpError("Signing up failed, please try again", 500));
  }
};

exports.validateBody = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  } else {
    return next();
  }
};

exports.signUp = async (req, res, next) => {
  const { name, email, password, passwordConfirmed } = req.body;
  if (password !== passwordConfirmed)
    return next(new HttpError("Passwords are not the same", 400));
  await checkIfUserAlreadyExists(email, next);

  const newUser = new User({
    name,
    email,
    password,
    passwordConfirmed
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError("Signing up failed, please try again", 500));
  }

  createAndSendToken(newUser, 201, req, res, next);
};

const findUser = async (email, next) => {
  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(
      new HttpError("Logging in failed, please try again later", 500)
    );
  }
  if (!user) {
    return next(new HttpError("Invalid email or password", 401));
  } else {
    return user;
  }
};

const comparePasswords = async (bodyPassword, userPassword, next) => {
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(bodyPassword, userPassword);
  } catch (error) {
    return next(
      new HttpError("Logging in failed, please try again later", 500)
    );
  }
  if (!isValidPassword) {
    return next(new HttpError("Invalid email or password", 401));
  }
  return isValidPassword;
};

exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findUser(email, next);

  if (user) {
    const isValidPassword = await comparePasswords(
      password,
      user.password,
      next
    );

    if (isValidPassword) {
      createAndSendToken(user, 200, req, res, next);
    }
  }
};
