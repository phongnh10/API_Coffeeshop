var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();
var categoeryModel = require("../models/category");

// http://localhost:4000/category/getCategories
//get
router.get("/", async function (req, res) {
  try {
    const categories = await categoeryModel.find({}, "-__v");
    if (!categories) {
      return res
        .status(400)
        .json({ status: false, message: "Không tìm thấy thể loại" });
    }
    return res.status(200).json({ status: true, categories });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message || "error" });
  }
});

router.post("/addCategory", async function (req, res, next) {
  try {
    const { name } = req.body;
    const addItem = { name };
    if (!addItem) {
      res
        .status(400)
        .json({ status: false, message: "Thêm thể loại thất bại" });
      return;
    }
    await categoeryModel.create(addItem);
    res.status(200).json({ satus: true, message: "Thêm thể loại thành công" });
  } catch (e) {
    res.status(400).json({ status: false, message: error.message || "error" });
  }
});

//update
router.put("/updateCategory", async function (req, res, next) {
  try {
    const { id, name } = req.body;
    let itemUpdate = await categoeryModel.findById(id);
    if (itemUpdate != null) {
      itemUpdate.name = name ? name : itemUpdate.name;
      itemUpdate.image = image ? image : itemUpdate.image;
      await itemUpdate.save();
      res
        .status(200)
        .json({ Status: true, message: "Sửa thể loại thành công" });
    } else {
      res.status(400).json({ status: false, message: "Sửa thể loại thất bại" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: error.message || "error" });
  }
});

module.exports = router;
