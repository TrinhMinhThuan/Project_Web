const express = require("express");
const viewRoute = express.Router();
const viewController = require('../controllers/view_controller');
const middle = require('../middleware/middleware');

viewRoute.get('/login', viewController.Login);
viewRoute.get('/login-admin', viewController.LoginAdmin);
viewRoute.get('/signup', viewController.Sigup);

viewRoute.get('/topUp', middle.authenticate, viewController.Topup)
//viewRoute.get('/', viewController.BookStore);

module.exports = viewRoute;