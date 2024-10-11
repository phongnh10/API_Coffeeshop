var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//monggose
const mongoose = require("mongoose");
require("./models/user");
require("./models/category");
require("./models/product");
require("./models/orderDetail");
require("./models/order");
require("./models/payment");

// router
var userRouter = require("./routes/user");
var productRouter = require("./routes/product");
var categoryRouter = require("./routes/category");
var favoriteRouter = require("./routes/favorite");
var orderDetailModel = require("./routes/orderDetail");
var orderModel = require("./routes/order");
var orderPayment = require("./routes/payment");
const paymentModel = require("./models/payment");

// view engine setup
var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//connect database
mongoose

  .connect(
    "mongodb+srv://phongnh10:G3JPLpKxkWLJrudJ@api-phongnh10.cla57.mongodb.net/md19201"
  )
  .then(() => console.log(">>>>>>>>>> DB Connected!!!!!!"))
  .catch((err) => console.log(">>>>>>>>> DB Error: ", err));

//http://localhost:3000
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/favorite", favoriteRouter);
app.use("/orderDetail", orderDetailModel);
app.use("/order", orderModel);
app.use("/payment", paymentModel);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
