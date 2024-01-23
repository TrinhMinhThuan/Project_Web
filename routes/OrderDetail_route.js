const express = require("express");
const orderDetailRoute = express.Router();

const orderDetailController = require('../controllers/OrderDetail_controller');

orderDetailRoute.get('/', orderDetailController.orderDetail)

module.exports = orderDetailRoute;

