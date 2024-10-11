const mongoose = require("mongoose");
const use = require("./user");
const product = require("./product");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const favorite = new Schema({
  id: { type: ObjectId },
  product: { type: ObjectId, ref: "product" },
  user: { type: ObjectId, ref: "user" },
});
module.exports =
  mongoose.models.favorite || mongoose.model("favorite", favorite);
