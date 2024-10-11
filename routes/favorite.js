var express = require("express");
var router = express.Router();
let favoriteModel = require("../models/favorite");
let userModel = require("../models/user");
let productModel = require("../models/product");

// Add favorite
router.post("/addFavorite", async function (req, res) {
  try {
    const { idProduct, idUser } = req.body;

    const isIdUser = await userModel.findById(idUser);
    if (!isIdUser) {
      return res
        .status(400)
        .json({ status: false, message: "Người dùng không tồn tại" });
    }
    const addFavorite = await productModel.findById(idProduct);
    if (!addFavorite) {
      return res
        .status(400)
        .json({ status: false, message: "Sản phẩm không tồn tại" });
    }
    const isFavorite = await favoriteModel.findOne({
      product: idProduct,
      user: idUser,
    });
    if (isFavorite) {
      return res.status(400).json({
        status: false,
        message: "Sản phẩm đã có trong danh sách yêu thích",
      });
    }

    await favoriteModel.create({ product: idProduct, user: idUser });
    res
      .status(200)
      .json({ status: true, message: "Thêm sản phẩm yêu thích thành công" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message || "error" });
  }
});

// Get favorites by user ID
router.get("/getFavoritesByIdUser", async function (req, res) {
  try {
    const { idUser } = req.query;
    const data = await favoriteModel.find({ user: idUser });

    if (data.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Không có sản phẩm yêu thích nào" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message || "error" });
  }
});

// Delete favorite by favorite ID
router.delete("/deleteFavorite/:idFavorite", async function (req, res) {
  try {
    const { idFavorite } = req.params;
    const itemFavorite = await favoriteModel.findById(idFavorite);

    if (!itemFavorite) {
      return res
        .status(400)
        .json({ status: false, message: "Không có sản phẩm yêu thích nào" });
    }

    await favoriteModel.findByIdAndDelete(idFavorite);
    res
      .status(200)
      .json({ status: true, message: "Xoá sản phẩm yêu thích thành công" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message || "error" });
  }
});

module.exports = router;

// Trong lập trình API, các thông tin được gửi giữa client và server thường được đặt ở ba vị trí chính: body, params, và headers. Mỗi vị trí có mục đích riêng biệt và được sử dụng trong những trường hợp khác nhau:

// 1. Body

// 	•	Khi nào sử dụng: Khi bạn muốn gửi dữ liệu lớn hoặc dữ liệu phức tạp (như JSON, XML) đến server, chẳng hạn như thông tin về người dùng, sản phẩm, hay dữ liệu biểu mẫu.
// 	•	Cách sử dụng:
// 	•	Phương thức: Thường được sử dụng với các phương thức như POST, PUT, PATCH.
// 	•	Dữ liệu trong body thường ở định dạng JSON (hoặc các định dạng khác như XML) và không xuất hiện trong URL.
// 	•	Ví dụ: Khi tạo mới hoặc cập nhật một tài nguyên.
// 	•	Ví dụ:

// POST /products
// {
//   "name": "Espresso",
//   "price": 2.99,
//   "description": "A strong black coffee."
// }

// 2. Params (Path Parameters và Query Parameters)

// 	•	Path Parameters:
// 	•	Khi nào sử dụng: Khi bạn cần truyền các giá trị để xác định một tài nguyên cụ thể trong đường dẫn URL (thường là ID hoặc một thuộc tính định danh).
// 	•	Cách sử dụng:
// 	•	Phương thức: Sử dụng với các phương thức GET, DELETE, PUT, PATCH.
// 	•	Dữ liệu được nhúng trực tiếp trong URL như một phần của “đường dẫn” và thường là không thay đổi.
// 	•	Ví dụ: Truy vấn hoặc thao tác với một tài nguyên cụ thể theo ID.

// GET /products/67068faec49174bfd85e42ea

// 	•	Query Parameters:
// 	•	Khi nào sử dụng: Khi bạn cần gửi các tham số lựa chọn hoặc lọc dữ liệu (dùng để phân trang, tìm kiếm, sắp xếp…).
// 	•	Cách sử dụng:
// 	•	Phương thức: Thường được sử dụng với GET.
// 	•	Dữ liệu xuất hiện ở phía sau dấu ? trong URL và thường không yêu cầu bảo mật cao.
// 	•	Ví dụ: Lọc, tìm kiếm, hoặc phân trang dữ liệu.

// GET /products?category=coffee&sort=price

// 3. Headers

// 	•	Khi nào sử dụng: Khi bạn cần gửi các thông tin meta-data về yêu cầu, chẳng hạn như thông tin xác thực (authentication), định dạng dữ liệu (content-type), hoặc các thông tin liên quan đến phiên làm việc (session tokens).
// 	•	Cách sử dụng:
// 	•	Headers không chứa dữ liệu tài nguyên trực tiếp mà chỉ chứa thông tin bổ sung.
// 	•	Ví dụ:
// 	•	Authorization: Token xác thực.
// 	•	Content-Type: Định dạng dữ liệu gửi đi (JSON, XML).
// 	•	Accept: Định dạng dữ liệu mong muốn nhận về từ server.
// 	•	Ví dụ:

// Authorization: Bearer some-jwt-token
// Content-Type: application/json

// Tóm tắt:

// 	•	Body: Sử dụng khi gửi dữ liệu phức tạp hoặc lớn (thông qua POST, PUT).
// 	•	Params (Path): Sử dụng để truyền giá trị cho một tài nguyên cụ thể qua URL.
// 	•	Query Params: Sử dụng để truyền dữ liệu lựa chọn hoặc lọc qua URL.
// 	•	Headers: Sử dụng cho thông tin meta-data như xác thực hoặc định dạng dữ liệu.
