const express = require("express");
const router = express.Router();
const orderModel = require("../models/order");
const userModel = require("../models/user");
const orderDetailModel = require("../models/orderDetail");

// add order
router.post("/addOrder", async function (req, res) {
  try {
    const { idOrderDetail, quantity, totalPrice, idUser } = req.body;
    const user = await userModel.findById(idUser);
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Người dùng không tồn tại" });
    }
    if (!quantity || !totalPrice || quantity <= 0 || totalPrice <= 0) {
      return res.status(400).json({
        status: false,
        message: "Số lượng hoặc tổng tiền không hợp lệ",
      });
    }
    const newOrder = await orderModel.create({
      quantity,
      totalPrice,
      user: idUser,
    });
    res.status(200).json({
      status: true,
      message: "Thêm đơn hàng thành công",
      order: newOrder,
    });
  } catch (error) {}
});

//getOrderDetails

// thay đổi orderDetail trong gio hang len sv
router.put("/updateOrderDetail", async function (req, res) {
  try {
    const { idUser, statusUpdate, idOrderUpdate } = req.body;
    const itemUpdate = await orderDetailModel.find({
      user: idUser,
      status: 0,
    });
    if (!item || check.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Không có đơn hàng chi tiết nào" });
    }
    await orderDetailModel.findOneAndUpdate(
      {
        user: idUser,
        status: 0,
      },
      {
        $set: {
          idOrder: idOrderUpdate,
        },
      },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: "Cập nhập chi tiết đơn hàng thành công",
      order: newOrder,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: "erol" });
  }
});

module.exports = router;
