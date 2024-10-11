const express = require("express");
const router = express.Router();
let productModel = require("../models/product");
let upload = require("../utils/configMulter");
let sendMail = require("../utils/configMail");
const { model } = require("mongoose");

//  - Lấy toàn bộ danh sách sản phẩm
router.get("/list", async function (req, res) {
  try {
    const data = await productModel.find();
    if (!data) {
      res.status(400).json({ status: false, message: "Thất Bại" });
      return;
    } else {
      res.json(data);
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "error" });
  }
});

// add product
router.post("/add", async function (req, res) {
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
    res.status(400).json({ Status: false, Message: "error" });
  }

  // deleta product
  router.delete("/delete", async function (req, res) {
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
      res.status(400).json({ status: false, message: "error" });
    }
  });
});
module.exports = router;
