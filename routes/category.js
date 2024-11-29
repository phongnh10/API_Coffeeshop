var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();
var categoryModel = require("../models/category");

// http://localhost:4000/category/getCategories
// GET
router.get("/", async function (req, res) {
  try {
    const categories = await categoryModel.find({}, "-__v");
    if (!categories || categories.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Không tìm thấy thể loại" });
    }
    return res.status(200).json({ status: true, categories });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: error.message || "Lỗi server" });
  }
});

// Add Category
router.post("/addCategory", async function (req, res) {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ status: false, message: "Tên thể loại không được để trống" });
    }

    const newCategory = new categoryModel({ name });
    await newCategory.save();

    res.status(200).json({ status: true, message: "Thêm thể loại thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: error.message || "Lỗi server" });
  }
});

// Update Category
router.put("/updateCategory", async function (req, res) {
  try {
    const { id, name, image } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "ID thể loại không hợp lệ" });
    }

    let category = await categoryModel.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Thể loại không tồn tại" });
    }

    category.name = name ? name : category.name;
    category.image = image ? image : category.image;

    await category.save();
    res.status(200).json({ status: true, message: "Sửa thể loại thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: error.message || "Lỗi server" });
  }
});

module.exports = router;
