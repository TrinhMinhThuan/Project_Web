const express = require("express");
const cartRoute = express.Router();
const CartController = require('../controllers/Carts_controller');

const middleware = require('../middleware/middleware');


cartRoute.get('/', middleware.authenticate, CartController.LoadAllItemOfCart);
cartRoute.get('/pay', middleware.authenticate, CartController.Pay)



module.exports = cartRoute;