const mongoose = require("mongoose");

const foodSchema = mongoose.Schema({
  title: {
    type: String,
    minlength: [10, "Every title should have at least 10 characters"],
    maxlength: [30, "Every title should not have more than 30 characters"],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    minlength: [20, "Every description should have at least 20 characters"],
    maxlength: [
      100,
      "Every description should not have more than 100 characters"
    ],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Food", foodSchema);
