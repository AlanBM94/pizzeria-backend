const express = require("express");
const commentController = require("../controllers/commentController");
const authorization = require("../middleware/auth");
const validation = require("../middleware/validateBody");
const { check } = require("express-validator");

const route = express.Router();

route.get("/:foodId", commentController.findCommentsByFood);

route.get("/", authorization.protect, commentController.findCommentsByUser);

route.post(
  "/",
  [check("comment").isLength({ min: 10, max: 120 })],
  authorization.protect,
  commentController.setFoodUserIds,
  validation.validateBody,
  commentController.createComment
);

route.patch(
  "/:commentId",
  [check("comment").isLength({ min: 10, max: 120 })],
  authorization.protect,
  validation.validateBody,
  commentController.updateComment
);

route.delete(
  "/:commentId",
  authorization.protect,
  commentController.deleteComment
);

module.exports = route;
