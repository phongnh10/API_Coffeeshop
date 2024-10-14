const express = require("express");
const router = express.Router();
let productModel = require("../models/product");
let upload = require("../utils/configMulter");
let sendMail = require("../utils/configMail");
const mongoose = require("mongoose");

//  - Lấy toàn bộ danh sách sản phẩm
router.get("/", async function (req, res) {
  try {
    const products = await productModel.find({}, "-__v");
    if (!products) {
      return res.status(400).json({ status: false, message: "Thất Bại" });
    } else {
      return res.status(200).json({ status: true, products });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "error" });
  }
});

// by id
router.get("/byCategory", async (req, res) => {
  const categoryId = req.query.categoryId;
  if (!categoryId) {
    return res.status(400).json({
      status: false,
      message: "Không tìm thấy categoryId",
    });
  }
  try {
    const products = await productModel.aggregate([
      { $match: { category: categoryId } },
    ]);
    if (products.length == 0) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
    return res.status(200).json({
      status: true,
      products,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

// Get product by _idProduct
router.get("/getproduct", async function (req, res) {
  try {
    const { idProduct } = req.query;
    const product = await productModel.findById(idProduct);

    if (!product) {
      return res
        .status(400)
        .json({ status: false, message: "Product not found" });
    }

    return res.status(200).json({ status: true, product });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

//

router.get("/getProductFavorite", async function (req, res) {
  const { idUser } = req.query;
  try {
    const userId = new mongoose.Types.ObjectId(idUser);
    const products = await productModel.aggregate([
      { $match: { user: userId } },
    ]);
    if (products.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Không có sản phẩm yêu thích nào được tìm thấy",
      });
    }
    return res.status(200).json({
      status: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error,
    });
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
