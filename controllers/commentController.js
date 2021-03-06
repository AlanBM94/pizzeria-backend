const Comment = require("../models/commentModel");
const HttpError = require("../models/http-error");

exports.setFoodUserIds = (req, res, next) => {
  if (!req.body.food) req.body.food = req.params.foodId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const findFoodComment = async (food, user, next) => {
  let foodComment;
  try {
    foodComment = await Comment.findOne({ food: food, user: user });
  } catch (error) {
    return next(new HttpError("Could not create a comment", 500));
  }
  return foodComment;
};

module.exports.createComment = async (req, res, next) => {
  const { comment, user, food } = req.body;
  let newComment;
  const existingFoodComment = await findFoodComment(food, user, next);

  if (existingFoodComment) {
    return next(new HttpError("You only can create a comment per food", 401));
  }

  try {
    newComment = await Comment.create({ comment, user, food });
  } catch (error) {
    return next(
      new HttpError("Could not create a comment, please try again later", 500)
    );
  }
  res.status(200).json({
    newComment
  });
};

module.exports.findCommentsByUser = async (req, res, next) => {
  const userId = req.user;
  let comments;

  try {
    comments = await Comment.find({ user: userId });
  } catch (error) {
    return next(new HttpError("Could not find comments by that user", 404));
  }

  res.status(200).json({
    comments
  });
};

module.exports.findCommentsByFood = async (req, res, next) => {
  const foodId = req.params.foodId;
  let comments;

  try {
    comments = await Comment.find({ food: foodId });
  } catch (error) {
    return next(new HttpError("Could not find comments by that food", 404));
  }

  res.status(200).json({
    comments
  });
};

const findComment = async (commentId, next) => {
  let updatedComment;
  try {
    updatedComment = await Comment.findById(commentId);
    return updatedComment;
  } catch (error) {
    return next(new HttpError("Could not find comment with that id", 404));
  }
};

module.exports.updateComment = async (req, res, next) => {
  const { comment } = req.body;
  const commentId = req.params.commentId;
  const updatedComment = await findComment(commentId, next);
  if (!updatedComment)
    return next(new HttpError("Could not find a comment for that id", 404));

  updatedComment.comment = comment;

  try {
    await updatedComment.save();
  } catch (error) {
    return next(new HttpError("Could not update comment", 500));
  }

  res.status(200).json({
    comment: updatedComment
  });
};

module.exports.deleteComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  const deletedComment = await (commentId, next);
  if (!deletedComment) {
    return next(new HttpError("Could not find a comment for that id", 404));
  } else {
    await Comment.findByIdAndRemove(commentId);
    res.status(200).json({ message: "Deleted place" });
  }
};
