const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const user = require("./user");

const order = new Schema({
  id: { type: ObjectId },
  quantity: { type: Number },
  totalPrice: { type: Number },
  date: { type: Date, default: Date.now },
  user: { type: ObjectId, ref: "user" },
  status: { type: Number, default: 0 },
});

module.exports = mongoose.models.order || mongoose.model("order", order);
