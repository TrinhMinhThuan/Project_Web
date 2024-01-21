const express = require("express");
const bookRouter = express.Router();
const book_controller = require('../controllers/Book_controller');

bookRouter.get("/admin/searchBook-Admin", book_controller.getSearchBook);

module.exports = bookRouter;