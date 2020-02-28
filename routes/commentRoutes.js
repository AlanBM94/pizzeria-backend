const express = require("express");
const commentController = require("../controllers/commentController");
const authorization = require("../middleware/auth");

const route = express.Router();

route.get("/:foodId", commentController.findCommentsByFood);

route.get("/", authorization.protect, commentController.findCommentsByUser);

route.post(
  "/",
  authorization.protect,
  commentController.setFoodUserIds,
  commentController.createComment
);

route.patch(
  "/:commentId",
  authorization.protect,
  commentController.updateComment
);

route.delete(
  "/:commentId",
  authorization.protect,
  commentController.deleteComment
);

module.exports = route;
