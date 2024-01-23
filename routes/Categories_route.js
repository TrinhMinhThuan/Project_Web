const express = require("express");
const categoriesRouter = express.Router();
const Categories_controller = require('../controllers/Categories_controller');
const middle = require('../middleware/middleware');

categoriesRouter.get("/searchCategories-Admin", middle.authenticateAdmin, Categories_controller.getSearchCategories);


categoriesRouter.delete("/categories/delete/:categoryId", middle.authenticateAdmin, Categories_controller.deleteCategories);

// Thêm
categoriesRouter.get("/addCategories-Admin", middle.authenticateAdmin, Categories_controller.addCategories)

// Sửa
categoriesRouter.get("/categories/edit/:categoryId", middle.authenticateAdmin, Categories_controller.editCategories)


module.exports = categoriesRouter;