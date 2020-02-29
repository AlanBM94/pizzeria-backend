const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const HttpError = require("./models/http-error");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const commentRoutes = require("./routes/commentRoutes");
const pizzaShopRoutes = require("./routes/pizzaShopRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/pizzaShops", pizzaShopRoutes);
app.use("/api/reservations", reservationRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  return next(error);
});

app.use((error, req, res, next) => {
  console.log(error);
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error ocurred!" });
});

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-qwvpk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};

mongoose
  .connect(url, config)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Working on port 5000");
    });
  })
  .catch(error => {
    console.log(error);
  });
