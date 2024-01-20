
const Product = require('../models/Users_model');


exports.Login = async (req, res, next) =>
{
    const result = await Product.getAll();
    res.render("loginPage", {
        title: "Đăng nhập",
      });
}

exports.BookStore = async (req,res,next)=>{
  const result = await Product.getAll();
  res.render("tempPage", {
      layout: 'customer',
      title: "Cửa hàng sách"
    });
}