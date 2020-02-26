const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"]
  },
  email: {
    type: String,
    required: [true, "Please tell us your email"],
    unique: true,
    lowercase: true
  },
  image: {
    type: String,
    default: "default.jpg"
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"]
  }
});

userSchema.pre("save", async function(next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
