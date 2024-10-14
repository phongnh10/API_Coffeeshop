const monggose = require("mongoose");
const Schema = monggose.Schema;
const ObjectId = Schema.ObjectId;
const use = require("./user");
const product = require("./product");
const order = require("./order");

const orderDetail = new Schema({
  id: { type: ObjectId },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  size: { type: String, required: true },
  product: { type: ObjectId, ref: "product", required: true },
  user: { type: ObjectId, ref: "user", required: true },
  order: { type: ObjectId, ref: "order", default: null },
  status: { type: Number, default: 0 },
});
module.exports =
  monggose.models.orderDetail || monggose.model("orderDetail", orderDetail);
