const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/Users_model');
const fetch = require('node-fetch');

const https = require('https');


const saltRounds = 13;
exports.CheckLogin = async (req, res, next) => {
    try {
        const body = (req.body);

        const user = await UserModel.getUserByUserName(body.Username);
        if (user) {

            const checkPass = await bcrypt.compare(body.Password, user.Password);
            if (checkPass && user.Role === 'Client') {
                const key = process.env.KEY;

                const token = jwt.sign(user, key, { expiresIn: '1h' });

                req.session.token = token;
                res.render('truePage', {
                    layout: 'account-form',
                    Username: req.Username,
                    notification: 'Đăng nhập thành công'
                })
            }
            else {
                res.render('errorPage', {
                    layout: 'account-form',
                    Username: req.Username,

                    error: 'Đăng nhập không thành công do sai username hoặc password'
                });
            }

        }
        else {
            res.render('errorPage', {
                layout: 'account-form',
                Username: req.Username,

                error: 'Đăng nhập không thành công do sai username hoặc password'
            });
        }



    } catch (error) {
        next(error);
    }
}


exports.CheckLoginAdmin = async (req, res, next) => {
    try {
        const body = (req.body);

        const user = await UserModel.getUserByUserName(body.Username);
        if (user) {

            const checkPass = await bcrypt.compare(body.Password, user.Password);
            if (checkPass && user.Role === 'Admin') {
                const key = process.env.KEY;
                const token = jwt.sign(user, key, { expiresIn: '1h' });

                req.session.token = token;
                res.render('truePage', {
                    layout: 'account-form',
                    admin: true,
                    Username: req.Username,
                    notification: 'Đăng nhập thành công'
                })
            }
            else {
                res.render('errorPage', {
                    layout: 'account-form',
                    Username: req.Username,

                    error: 'Đăng nhập không thành công do sai username hoặc password'
                });
            }

        }
        else {
            res.render('errorPage', {
                layout: 'account-form',
                Username: req.Username,

                error: 'Đăng nhập không thành công do sai username hoặc password'
            });
        }



    } catch (error) {
        next(error);
    }
}

exports.CheckUsernameExists = async (req, res) => {

    const result = await UserModel.getUserByUserName(req.query.username);
    if (result != undefined) {
        return res.json({ result: 1 });
    }

    return res.json({ result: 0 });
}

exports.Signup = async (req, res, next) => {
    try {
        const user = (req.body);

        user.Password = await bcrypt.hash(user.Password, saltRounds);
        const PAY_PORT = process.env.PAY_SERVER_PORT;
        const agent = new https.Agent({
            //ca: process.env.CERT,
            rejectUnauthorized: false
        });

        const _fetch = await fetch(`https://localhost:${PAY_PORT}/createUser`, {
            agent,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });


        const resJson = await _fetch.json();
        const resStatus = resJson._status;
        if (!resStatus) {
            res.render('errorPage', {
                layout: 'account-form',
                Username: req.Username,

                error: 'Đăng ký không thành công'
            });
        }
        else {
                res.render('truePage', {
                layout: 'account-form',
                Username: req.Username,

                error: 'Đăng ký thành công'
            });
        }

    } catch (error) {
        next(error);
    }
}




exports.Logout = (req, res, next) => {
    try {
        req.session.token = null;
        res.render('truePage', {
            Username: req.Username,
            layout: 'account-form',
            notification: 'Đăng xuất thành công'
        });
    } catch (error) {
        next(error);
    }
}

