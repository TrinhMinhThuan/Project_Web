

const express = require("express");
const PayRoute = express.Router();
const PayController = require('../controllers/PayServer_controller');


PayRoute.post('/createUser', PayController.createUser)
PayRoute.post('/pay', PayController.Pay)


module.exports = PayRoute;
