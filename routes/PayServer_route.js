const express = require("express");
const PayRoute = express.Router();
const PayController = require('../controllers/PayServer_controller');


PayRoute.post('/createUser', PayController.createUser);
PayRoute.post('/deleteUser', PayController.deleteUser); 
PayRoute.post('/editUser', PayController.editUser);

PayRoute.post('/pay', PayController.Pay);
PayRoute.post('/getBalance', PayController.GetBalance);
PayRoute.post('/topup', PayController.Topup)



module.exports = PayRoute;
