var express = require("express");
var router = express.Router();
const userModel = require("../models/user");

// Register
router.post("/register", async function (req, res) {
  try {
    const { email, password, name } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ Status: false, Message: "Tài khoản đã tồn tại" });
    } else {
      addUser = await userModel.create({ email, password, name });
      res.status(200).json({ Status: true, Message: "Đăng ký thành công" });
    }
  } catch (error) {
    res.status(400).json({ Status: false, Message: error.Message || "error" });
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
        .json({ Status: false, Message: "Sai tài khoản hoặc mật khẩu" });
    } else {
      res.status(200).json({ Status: true, Message: "Đăng nhập thành công" });
    }
  } catch (e) {
    res.status(400).json({ Status: false, Message: "error" });
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
