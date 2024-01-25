const express = require("express");
const UserRoute = express.Router();
const UserController = require('../controllers/User_controller');
const mdw = require('../middleware/middleware')

UserRoute.get('/google/client-auth', UserController.GoogleClientAuth);
UserRoute.get('/google/admin-auth', UserController.GoogleAdminAuth);
UserRoute.get('/google/:type', UserController.GoogleRedirect);
UserRoute.post('/login', UserController.CheckLogin);
UserRoute.post('/login-admin', UserController.CheckLoginAdmin);
UserRoute.get('/logout', UserController.Logout);
UserRoute.get('/checkUsernameExists', UserController.CheckUsernameExists);
UserRoute.get('/checkIDExists', UserController.CheckIDExists);
UserRoute.post('/signup', UserController.Signup);
UserRoute.get('/profile', mdw.authenticate, UserController.GetProfile);

UserRoute.get('/accounts', mdw.authenticateAdmin, UserController.getSearchAccounts);
UserRoute.delete("/accounts/delete/:userID", mdw.authenticateAdmin, UserController.deleteAccount);
UserRoute.get("/accounts/edit/:userID", mdw.authenticateAdmin, UserController.getEditAccount);
UserRoute.post("/accounts/edit/:userID", mdw.authenticateAdmin, UserController.editAccount);
UserRoute.get("/accounts/add", mdw.authenticateAdmin, UserController.getAddAccount);
UserRoute.post("/accounts/add", mdw.authenticateAdmin, UserController.addAccount);

module.exports = UserRoute;

