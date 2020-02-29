const express = require("express");
const authorization = require("../middleware/auth");
const reservationController = require("../controllers/reservationControllers");
const { check } = require("express-validator");
const validation = require("../middleware/validateBody");

const router = express.Router();

router.get(
  "/",
  authorization.protect,
  reservationController.getReservationsByUser
);
router.post(
  "/",
  [
    check("pizzaShop")
      .not()
      .isEmpty(),
    check("numberOfPeople")
      .not()
      .isEmpty(),
    check("date")
      .not()
      .isEmpty()
  ],
  authorization.protect,
  validation.validateBody,
  reservationController.createReservation
);

module.exports = router;
