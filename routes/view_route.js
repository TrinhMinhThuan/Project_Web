const express = require("express");
const viewRoute = express.Router();
const viewController = require('../controllers/view_controller');
const middle = require('../middleware/middleware');

viewRoute.get('/login', viewController.Login);
viewRoute.get("/addCategories", middle.authenticate, (req,res,next) =>{
    res.render("addCategories", {
      title: "Quản lý danh mục",
    });
  });

module.exports = viewRoute;