const express = require("express");
const viewRoute = express.Router();
const viewController = require('../controllers/view_controller');
const middle = require('../middleware/middleware');

viewRoute.get('/login', viewController.Login);

module.exports = viewRoute;