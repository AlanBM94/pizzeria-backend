const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      minLenght: 10
    },
    date: {
      type: Date,
      default: Date.now
    },
    food: {
      type: mongoose.Schema.ObjectId,
      ref: "Food",
      required: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

commentSchema.index({ food: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Comment", commentSchema);
