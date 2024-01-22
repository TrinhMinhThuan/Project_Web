const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/Users_model');
const fetch = require('node-fetch');
const https = require('https');

const saltRounds = 13;

const urlGG = 'https://accounts.google.com/o/oauth2/v2/auth';
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'https://localhost:3000/google/auth';
const response_type = 'code';
const grant_type = 'authorization_code';
const scopes=['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

exports.GoogleRedirect = (req, res) => {
    const queries = new URLSearchParams({
        response_type,
        redirect_uri,
        client_id,
        scope: scopes.join(' ')
    });
    
    res.redirect(`${urlGG}?${queries.toString()}`);
}

exports.GoogleAuth = async (req, res, next) => {
    try {
        const code = req.query.code;

        const options = {
            code,
            grant_type,
            client_id,
            client_secret,
            redirect_uri,
            scope: scopes.join(' ')
        };
        
        const rs = await fetch('https://accounts.google.com/o/oauth2/token', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(options)
        });
        
        const data = await rs.json();

         const userInfo = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${data.access_token}`, {
            method: 'GET'
        });

        const userData = await userInfo.json();
        const decodedToken = jwt.decode(data.id_token);
        let user = await UserModel.getUserByGoogleID(decodedToken.sub);
    
        if (!user)
        {
            user = {};
            user.GoogleID = decodedToken.sub;
            user.Username = null;
            user.Password = null;
            user.Email = null;
            
            const PAY_PORT = process.env.PAY_SERVER_PORT;
            const agent = new https.Agent({
                //ca: process.env.CERT,
                rejectUnauthorized: false
            });
            
            await fetch(`https://localhost:${PAY_PORT}/createUser`, {
                agent,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
        } 
        
        user.Username = userData.name;
        const key = process.env.PRIVATE_KEY;
        const token = jwt.sign(user, key, { expiresIn: '1h'});
        req.session.token = token;
        
        res.render('truePage', {
            layout: 'account-form',
            Username: user.Username,
            notification: 'Đăng nhập thành công'
        })
    }
    catch (error) {
        next(error);
    }
}

exports.CheckLogin = async (req, res, next) => {
    try {
        const body = (req.body);

        const user = await UserModel.getUserByUserName(body.Username);
        if (user) {

            const checkPass = await bcrypt.compare(body.Password, user.Password);
            if (checkPass && user.Role === 'Client') {
                const key = process.env.PRIVATE_KEY;

                const token = jwt.sign(user, key, { expiresIn: '1h'});

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
                const key = process.env.PRIVATE_KEY;

                const token = jwt.sign(user, key, { expiresIn: '1h'});

                req.session.token = token;
                res.render('truePage', {
                    layout: 'account-form',
                    Username: req.Username,
                    admin: true,
                    _admin: true,
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
        user.GoogleID = null;
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

