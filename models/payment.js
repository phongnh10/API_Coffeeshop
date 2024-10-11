const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const user = require("./user");
const order = require("./order");

const payment = new Schema({
  id: { type: ObjectId },
  quantity: { type: Number },
  totalPrice: { type: Number },
  date: { type: Date, default: Date.now },
  user: { type: ObjectId, ref: "user" },
  order: { type: ObjectId, ref: "order" },
  status: { type: Number, default: 0 },
});

module.exports = mongoose.models.payment || mongoose.model("payment", payment);
