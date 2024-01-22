const express = require("express");
const categoriesRouter = express.Router();
const Categories_controller = require('../controllers/Categories_controller');
const middle = require('../middleware/middleware');

categoriesRouter.get("/searchCategories-Admin", Categories_controller.getSearchCategories);

categoriesRouter.get("/",  Categories_controller.getSearchCategories);
 
categoriesRouter.delete("/categories/delete/:categoryId", Categories_controller.deleteCategories);

// Thêm
categoriesRouter.get("/addCategories-Admin", Categories_controller.addCategories)

// Sửa
categoriesRouter.get("/categories/edit/:categoryId", Categories_controller.editCategories)


module.exports = categoriesRouter;