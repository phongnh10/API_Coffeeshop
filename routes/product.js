const express = require("express");
const router = express.Router();
let productModel = require("../models/product");
let upload = require("../utils/configMulter");
let sendMail = require("../utils/configMail");
const { model } = require("mongoose");
const mongoose = require("mongoose");

//  - Lấy toàn bộ danh sách sản phẩm
router.get("/getProducts", async function (req, res) {
  try {
    const data = await productModel.find();
    if (!data) {
      res.status(400).json({ status: false, message: "Thất Bại" });
      return;
    } else {
      res.status(true).json(data);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "error" });
  }
});

// by id
router.get("/getProductByIdCategory/:idCategory", async function (req, res) {
  try {
    const { idCategory } = req.params;

    // Chuyển đổi idCategory thành ObjectId
    const categoryId = mongoose.Types.ObjectId(idCategory);

    // Tìm kiếm sản phẩm theo category
    const products = await productModel.find({ category: categoryId });

    // Kiểm tra nếu không có sản phẩm nào được tìm thấy
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Không tìm thấy sản phẩm nào." });
    }

    // Trả về danh sách sản phẩm
    res.json({ status: true, data: products });
  } catch (error) {
    console.error(error); // In ra lỗi để dễ dàng debug
    res
      .status(500)
      .json({ status: false, message: "Có lỗi xảy ra", error: error.message });
  }
});
// add product
router.post("/addProduct", async function (req, res) {
  try {
    const {
      image,
      name,
      sort_description,
      description,
      rating,
      rating_quantity,
      price,
      category,
    } = req.body;

    const addProduct = {
      image,
      name,
      sort_description,
      description,
      rating,
      rating_quantity,
      price,
      category,
    };
    if (!addProduct) {
      res
        .status(400)
        .json({ Status: false, Message: "Thêm sản phẩm thất bại" });
      return;
    } else {
      await productModel.create({
        image,
        name,
        sort_description,
        description,
        rating,
        rating_quantity,
        price,
        category: category,
      });
      res
        .status(200)
        .json({ Status: true, Message: "Thêm sản phẩm thành công" });
    }
  } catch (error) {
    res.status(500).json({ Status: false, Message: "error" });
  }

  // deleta product
  router.delete("/deleteProduct", async function (req, res) {
    try {
      const { id } = req.body;
      const itemDelete = await productModel.findById(id);
      if (itemDelete) {
        await productModel.findByIdAndDelete(id);
        res
          .status(200)
          .json({ status: true, message: "Xoá sản phẩm thành công" });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Không tìm thấy sản phẩm" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: "error" });
    }
  });
});
module.exports = router;
