const express = require("express");
const router = express.Router();
const orderDetailModel = require("../models/orderDetail");
const productModel = require("../models/product");
const userModel = require("../models/user");
const orderModel = require("../models/order");
const mongoose = require("mongoose");

// Add order detail
router.post("/addOrderDetail", async function (req, res) {
  try {
    const { quantity, totalPrice, idProduct, idUser, status = 0 } = req.body;

    const user = await userModel.findById(idUser);
    const product = await productModel.findById(idProduct);

    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Tài khoản không tồn tại" });
    }

    if (!product) {
      return res
        .status(400)
        .json({ status: false, message: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra số lượng và tổng giá tiền
    if (!quantity || !totalPrice || quantity <= 0 || totalPrice <= 0) {
      return res.status(400).json({
        status: false,
        message: "Số lượng hoặc tổng tiền không hợp lệ",
      });
    }

    await orderDetailModel.create({
      quantity,
      totalPrice,
      product: idProduct,
      user: idUser,
      status,
    });

    res
      .status(200)
      .json({ status: true, message: "Thêm chi tiết đơn hàng thành công" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message || "error" });
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

    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message || "error" });
  }
});

module.exports = router;
