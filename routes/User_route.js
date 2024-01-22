const express = require("express");
const UserRoute = express.Router();
const UserController = require('../controllers/User_controller');

UserRoute.get('/google/auth', UserController.GoogleAuth);
UserRoute.get('/google', UserController.GoogleRedirect);
UserRoute.post('/login', UserController.CheckLogin);
UserRoute.post('/login-admin', UserController.CheckLoginAdmin);
UserRoute.get('/logout', UserController.Logout);
UserRoute.get('/checkUsernameExists', UserController.CheckUsernameExists);
UserRoute.post('/signup', UserController.Signup);


module.exports = UserRoute;

