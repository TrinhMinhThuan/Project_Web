const express = require("express");
const bookRouter = express.Router();
const book_controller = require('../controllers/Products_controller');
const middle = require('../middleware/middleware');

bookRouter.get("/admin/searchBook-Admin", middle.authenticateAdmin, book_controller.getSearchBook);

module.exports = bookRouter;