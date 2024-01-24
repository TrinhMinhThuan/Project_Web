const express = require("express");
const categoriesRouter = express.Router();
const Categories_controller = require('../controllers/Categories_controller');
const middle = require('../middleware/middleware');

categoriesRouter.get("/searchCategories-Admin", middle.authenticateAdmin, Categories_controller.getSearchCategories);

<<<<<<< HEAD

categoriesRouter.delete("/categories/delete/:categoryId", middle.authenticateAdmin, Categories_controller.deleteCategories);

// Thêm
categoriesRouter.get("/addCategories-Admin", middle.authenticateAdmin, Categories_controller.addCategories)

// Sửa
categoriesRouter.get("/categories/edit/:categoryId", middle.authenticateAdmin, Categories_controller.editCategories)

=======
 
categoriesRouter.delete("/categories/delete/:categoryId",  Categories_controller.deleteCategories);

// Thêm
categoriesRouter.get("/addCategories-Admin", middle.authenticateAdmin, Categories_controller.addCategories);

// Sửa
categoriesRouter.get("/categories/edit/:categoryId", middle.authenticateAdmin, Categories_controller.editCategories)
>>>>>>> 1235c961ea072af716a4f412e9541a63d6b54030

module.exports = categoriesRouter;