const mongoose = require("mongoose");
const category = require("./category");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const product = new Schema({
  id: { type: ObjectId }, // Khoa chính
  image: { type: String },
  name: { type: String },
  sort_description: { type: String },
  description: { type: String },
  rating: { type: Number },
  rating_quantity: { type: Number },
  price: { type: Number },
  category: [{ type: ObjectId, ref: "category" }], // khoa ngoai
});

module.exports = mongoose.models.product || mongoose.model("product", product);
