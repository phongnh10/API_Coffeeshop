const express = require("express");
const router = express.Router();
const orderDetailModel = require("../models/orderDetail");
const productModel = require("../models/product");
const userModel = require("../models/user");
const orderModel = require("../models/order");
const mongoose = require("mongoose");

// Add order detail
router.post("/addOrderDetail", async (req, res) => {
  try {
    const { quantity, totalPrice, size, idProduct, idUser, order, status } =
      req.body;

    // Kiểm tra sự tồn tại của người dùng và sản phẩm
    const user = await userModel.findById(idUser);
    const product = await productModel.findById(idProduct);

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Tài khoản không tồn tại" });
    }
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Sản phẩm không tồn tại" });
    }
    if (!quantity || !totalPrice || !size || !idProduct || !idUser) {
      return res
        .status(404)
        .json({ status: false, message: "Thiếu thông tin sản phẩm" });
    }

    // Tạo chi tiết đơn hàng mới
    const newOrderDetail = await orderDetailModel.create({
      quantity,
      totalPrice,
      size,
      product: idProduct,
      user: idUser,
      order: null,
      status,
    });

    res.status(201).json({
      status: true,
      message: "Thêm chi tiết đơn hàng thành công",
      data: newOrderDetail, // Trả lại chi tiết đơn hàng vừa thêm
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
});

// Get order detail by user ID and status
router.get("/getOrderDetailByIdUserAndStatus", async function (req, res) {
  try {
    const { idUser, status } = req.query;

    const orderDetails = await orderDetailModel
      .find({ user: idUser, status })
      .populate("product");

    if (!orderDetails || orderDetails.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Không có chi tiết đơn hàng nào với trạng thái này",
      });
    }

    res.status(200).json({ status: true, orderDetails: orderDetails });
  } catch (error) {
    res.status(400).json({ status: false, message: "error" });
  }
});

module.exports = router;
