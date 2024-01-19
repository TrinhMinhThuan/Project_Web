
const UserModel = require('../models/Users_model');

exports.CheckLogin = async (req, res, next) => {
    try {
        console.log(req.body);
    } catch (error) {
        next(error);
    }
}


