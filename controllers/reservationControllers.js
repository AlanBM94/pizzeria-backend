const Reservation = require("../models/reservationModel");
const HttpError = require("../models/http-error");

module.exports.getReservationsByUser = async (req, res, next) => {
  const { user } = req;
  try {
    const reservations = await Reservation.find({ user }).populate("shop");
    res.status(200).json({
      reservations
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not find reservations", 500));
  }
};

module.exports.createReservation = async (req, res, next) => {
  const user = req.user;
  const { pizzaShop, numberOfPeople, date } = req.body;
  try {
    const newReservation = await Reservation.create({
      user,
      shop: pizzaShop,
      numberOfPeople,
      date
    });
    res.status(201).json({
      newReservation
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not create a reservation", 500));
  }
};
