const express = require("express");
const productRouter = express.Router();
const product_controller = require('../controllers/Products_controller');
const middle = require('../middleware/middleware');

//upload image
const multer  = require('multer');
const path = require('path');
// Upload ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/Images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Sử dụng tên gốc của tệp
    }
  });
 const upload = multer({ storage: storage });

// admin
productRouter.get('/admin',  product_controller.getSearchBook);
productRouter.get("/admin/searchBook-Admin",  product_controller.getSearchBook);
productRouter.get("/admin/book/edit/:productId",product_controller.editBook);
productRouter.post("/admin/book/edit/:productId", upload.single('image'), product_controller.editBook);
productRouter.get("/admin/addBook-Admin",product_controller.addBook);
productRouter.post("/admin/addBook-Admin",upload.single('image'),product_controller.addBook);

productRouter.get("/admin/salesRevenue",product_controller.salesRevenue );
productRouter.get("/admin/getStatisticalData-Admin", product_controller.getStatisticalData);


// client
productRouter.get("/",  product_controller.getSearchBook_client);
productRouter.get("/searchBook", middle.authenticate, product_controller.getSearchBook_client);
productRouter.get("/getStatisticalData",product_controller.getStatisticalData_client );
productRouter.get("/hotbook", product_controller.gethotBook_client);

module.exports = productRouter;