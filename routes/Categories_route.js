const express = require("express");
const categoriesRouter = express.Router();
const Categories_controller = require('../controllers/Categories_controller');

//Không hiểu sao lại bị lỗi cái này
categoriesRouter.get("/admin/searchCategories-Admin", Categories_controller.getSearchCategories);

categoriesRouter.get("/admin",  Categories_controller.getSearchCategories);
 
categoriesRouter.delete("/admin/categories/delete/:categoryId", Categories_controller.deleteCategories);

// Thêm
categoriesRouter.get("/admin/addCategories-Admin", Categories_controller.addCategories)

// Sửa
categoriesRouter.get("/admin/categories/edit/:categoryId", Categories_controller.editCategories)


module.exports = categoriesRouter;