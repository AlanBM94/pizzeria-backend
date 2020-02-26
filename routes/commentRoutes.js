const express = require("express");
const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");

const route = express.Router();

route.use(userController.protect);

route.get("/", commentController.findCommentsByUser);

route.get("/:foodId", commentController.findCommentsByFood);

route.post(
  "/",
  commentController.setFoodUserIds,
  commentController.createComment
);

module.exports = route;
