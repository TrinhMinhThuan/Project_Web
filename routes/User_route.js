const express = require("express");
const UserRoute = express.Router();
const UserController = require('../controllers/User_controller');

UserRoute.post('/login', (req,res) =>
{
    console.log(req.body);
});

//UserRoute.post('/login', UserController.CheckLogin);

module.exports = UserRoute;