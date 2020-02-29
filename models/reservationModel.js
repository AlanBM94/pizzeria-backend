const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  shop: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "PizzaShop"
  },
  date: {
    type: Date,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Reservation", reservationSchema);
