const express = require("express");
const viewRoute = express.Router();
const viewController = require('../controllers/view_controller');
const middle = require('../middleware/middleware');

viewRoute.get('/login', viewController.Login);

//Không hiểu sao lại bị lỗi cái này
viewRoute.get("/admin/searchCategories-Admin", viewController.getSearchCategories);

viewRoute.get("/admin",  viewController.getSearchCategories);
 
viewRoute.delete("/admin/categories/delete/:categoryId", viewController.deleteCategories);
module.exports = viewRoute;