const HttpError = require("../models/http-error");
const { promisify } = require("util");
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
      userId: newUser.Id,
      name: newUser.name,
      email: newUser.email
    });

    return token;
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
  const { name, email, password, passwordConfirm } = req.body;
  if (password !== passwordConfirm)
    return next(new HttpError("Passwords are not the same", 400));
  await checkIfUserAlreadyExists(email, next);

  const newUser = new User({
    name,
    email,
    password,
    passwordConfirm
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
