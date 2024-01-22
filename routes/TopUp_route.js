const express = require("express");
const topupRoute = express.Router();
const topupControlller = require('../controllers/TopUp_controller');
const mdw = require('../middleware/middleware');

topupRoute.post('/', mdw.authenticate, topupControlller.Topup);

module.exports = topupRoute;

