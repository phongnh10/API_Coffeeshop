var express = require("express");
var router = express.Router();
let productModel = require("../models/product");
let upload = require("../utils/configMulter");
let sendMail = require("../utils/configMail");
const mongoose = require("mongoose");

//  - Lấy toàn bộ danh sách sản phẩm
router.get("/", async function (req, res) {
  try {
    const products = await productModel.find({}, "-__v");
    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Không có sản phẩm nào" });
    } else {
      return res.status(200).json({ status: true, products });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Lỗi server", error: error.message });
  }
});

// Lấy sản phẩm theo categoryId
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
    if (products.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Không có sản phẩm nào trong danh mục này",
      });
    }
    return res.status(200).json({
      status: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Lấy sản phẩm theo id
router.get("/getproduct", async function (req, res) {
  try {
    const { idProduct } = req.query;
    if (!idProduct) {
      return res
        .status(400)
        .json({ status: false, message: "idProduct không hợp lệ" });
    }
    const product = await productModel.findById(idProduct);

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Sản phẩm không tồn tại" });
    }

    return res.status(200).json({ status: true, product });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Lỗi server", error: error.message });
  }
});

// Lấy sản phẩm yêu thích theo userId
router.get("/getProductFavorite", async function (req, res) {
  const { idUser } = req.query;
  if (!idUser) {
    return res.status(400).json({
      status: false,
      message: "idUser không hợp lệ",
    });
  }
  try {
    const userId = new mongoose.Types.ObjectId(idUser);
    const products = await productModel.aggregate([
      { $match: { user: userId } },
    ]);
    if (products.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Không có sản phẩm yêu thích nào",
      });
    }
    return res.status(200).json({
      status: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
});

// Thêm sản phẩm mới
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

    if (
      !image ||
      !name ||
      !sort_description ||
      !description ||
      !rating ||
      !rating_quantity ||
      !price ||
      !category
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Thiếu thông tin sản phẩm" });
    }

    const newProduct = {
      image,
      name,
      sort_description,
      description,
      rating,
      rating_quantity,
      price,
      category,
    };

    await productModel.create(newProduct);
    res.status(200).json({ status: true, message: "Thêm sản phẩm thành công" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Lỗi server khi thêm sản phẩm",
        error: error.message,
      });
  }
});

// Xoá sản phẩm
router.delete("/deleteProduct", async function (req, res) {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "id sản phẩm không hợp lệ" });
    }

    const itemDelete = await productModel.findById(id);
    if (!itemDelete) {
      return res
        .status(404)
        .json({ status: false, message: "Không tìm thấy sản phẩm" });
    }

    await productModel.findByIdAndDelete(id);
    res.status(200).json({ status: true, message: "Xoá sản phẩm thành công" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Lỗi server khi xoá sản phẩm",
        error: error.message,
      });
  }
});

module.exports = router;
