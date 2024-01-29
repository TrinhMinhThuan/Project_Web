
const TopupModel = require('../models/TopUp_model');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/Users_model');
const https = require('https');
const fetch = require('node-fetch');
exports.Topup = async (req, res, next) => {

    try {
        const _user = await UserModel.getUserByUserID(req.user.UserID);
        if (_user) {

            const Amount = req.body.Amount;
            const UserID = req.user.UserID;

            const key = process.env.PRIVATE_KEY;

            const user = jwt.sign({ UserID, Amount }, key, { expiresIn: '1h' });


            const PAY_PORT = process.env.PAY_SERVER_PORT;


            const agent = new https.Agent({
                //ca: process.env.KEY,
                rejectUnauthorized: false
            });

            const secret = jwt.sign({ secret: process.env.SERVER_SECRET }, key, { expiresIn: '1h' });

            const _fetch = await fetch(`https://localhost:${PAY_PORT}/topup`, {
                agent,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user, secret }),
            });


            const resJson = await _fetch.json();

            if (resJson._status) {
                const result = await TopupModel.create(UserID, Amount);
                res.render('truePage', {
                    layout: 'customer',
                    Username: req.Username,
                    notification: 'Nạp tiền thành công',
                    //title: 'Trạng thái'
                });
            }
            else {
                res.render('errorPage', {
                    layout: 'customer',
                    Username: req.Username,
                    error: 'Nạp tiền không thành công, vui lòng thử lại'
                });
            }
        }
        else
        {
            req.session.token = null;
            res.redirect(req.url);
        }

    } catch (error) {
        res.render('errorPage', {
            layout: 'customer',
            Username: req.Username,
            error: 'Nạp tiền không thành công, vui lòng thử lại'
        });
    }
}



