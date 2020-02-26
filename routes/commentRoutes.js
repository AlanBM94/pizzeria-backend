const express = require("express");
const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");

const route = express.Router();

route.get("/:foodId", commentController.findCommentsByFood);

route.use(userController.protect);

route.get("/", commentController.findCommentsByUser);

route.post(
  "/",
  commentController.setFoodUserIds,
  commentController.createComment
);

route.patch("/:commentId", commentController.updateComment);

route.delete("/:commentId", commentController.deleteComment);

module.exports = route;
