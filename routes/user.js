var express = require("express");
var router = express.Router();
const userModel = require("../models/user");
const mongoose = require("mongoose");

// Register
router.post("/register", async function (req, res) {
  try {
    const { email, password, name } = req.body;

    // Kiểm tra xem người dùng đã tồn tại chưa
    const user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ status: false, message: "Tài khoản đã tồn tại" });
    }

    await userModel.create({ email, password, name });
    res.status(200).json({ status: true, message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ status: false, message: "Có lỗi xảy ra", error: error.message });
  }
});

//Login
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || user.password !== password) {
      return res
        .status(400)
        .json({ status: false, message: "Sai tài khoản hoặc mật khẩu" });
    } else {
      res.status(200).json({ status: true, message: "Đăng nhập thành công" });
    }
  } catch (e) {
    res.status(400).json({ status: false, message: "error" });
  }
});
//ForgotPassword
router.post("/forgotPassword", async function (req, res) {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({ Status: false, Message: "Sai tài khoản" });
    } else {
      res
        .status(200)
        .json({ Status: true, Message: "Gửi mã xác thực thành công" });
    }
  } catch (error) {
    res.status(400).json({ Status: false, Message: "error" });
  }
});
module.exports = router;
