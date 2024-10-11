const monggose = require("mongoose");
const Schema = monggose.Schema;
const ObjectId = Schema.ObjectId;
const use = require("./user");
const product = require("./product");
const order = require("./order");

const orderDetail = new Schema({
  id: { type: ObjectId },
  quantity: { Number },
  totalPrice: { Number },
  product: { type: ObjectId, ref: "product" },
  user: { type: ObjectId, ref: "user" },
  order: { type: ObjectId, ref: "order" },
  status: { type: Number, default: 0 },
});
module.exports =
  monggose.models.orderDetail || monggose.model("orderDetail", orderDetail);
