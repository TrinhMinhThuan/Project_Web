const express = require("express");
const bookRouter = express.Router();
const book_controller = require('../controllers/Products_controller');
const middle = require('../middleware/middleware');

// admin
bookRouter.get("/admin/searchBook-Admin",  book_controller.getSearchBook);


// client
bookRouter.get("/",  book_controller.getSearchBook_client);
bookRouter.get("/searchBook", middle.authenticate, book_controller.getSearchBook_client);

module.exports = bookRouter;