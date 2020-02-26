const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const usersController = require("../controllers/userController");

router.post(
  "/signup",
  [
    check("name")
      .not()
      .isEmpty(),
    check("email")
      .normalizeEmail()
      .isEmail(),
    check("password").isLength({ min: 8 })
  ],
  usersController.validateBody,
  usersController.signUp
);

router.post("/login", usersController.logIn);

module.exports = router;
