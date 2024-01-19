const jwt = require('jsonwebtoken');
const UserModel = require('../models/Users_model');

exports.CheckLogin = async (req, res, next) => {
    try {
        const body = (req.body);

        const user = await UserModel.getUserByUserName(body.Username);


        if (user.Password === body.Password && user.Role === 'Client') {
            const token = jwt.sign(user, 'hhh', { expiresIn: '1h' });
           // res.json(token);
           req.session.token = token;
            res.render('truePage',{notification: 'Đăng nhập thành công'} )
        }
        else {
            res.render('errorPage', {error: 'Đăng nhập không thành công do sai username hoặc password'});
        }


    } catch (error) {
        next(error);
    }
}

exports.getProfile = (req, res) => {
    res.json({ user: req.user });
};


