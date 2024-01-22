const Product = require('../models/Users_model');

exports.Login = (req, res, next) =>
{
    res.render("loginPage", {
      layout: 'account-form',
        Username: req.Username,
        title: "Đăng nhập",
      });
}

exports.LoginAdmin = (req, res, next) =>
{
    
    res.render("loginPage", {
      layout: 'account-form',
        Username: req.Username,
        admin: true,
        title: "Đăng nhập vào tài khoản admin",
      });
}



exports.Sigup =  (req, res, next) =>
{
    res.render("signupPage", {
      layout: 'account-form',
      Username: req.Username,
        title: "Đăng ký tài khoản",
      });
}

exports.BookStore = async (req,res,next)=>{
  const result = await Product.getAll();
  res.render("tempPage", {
      layout: 'customer',
      Username: req.Username,
      title: "Cửa hàng sách"
    });
}

exports.clientHome = (req, res, next) =>
{
  res.render("truePage", {
    layout: 'customer',
    Username: req.Username,
      title: "Book Store",
    });
}