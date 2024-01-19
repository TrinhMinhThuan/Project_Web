const express = require("express");
const UserRoute = express.Router();
const UserController = require('../controllers/User_controller');

UserRoute.post('/login', UserController.CheckLogin);

//UserRoute.post('/login', UserController.CheckLogin);

module.exports = UserRoute;


function ensureAuthenticated(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    // Xác minh JWT
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      req.user = decoded;
      next();
    });
  }
  