const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/Users_model');
const OrdersModel = require('../models/Orders_model');
const OrderDetailModel = require('../models/Order_Detail_model');
const TopupModel = require('../models/TopUp_model');
const fetch = require('node-fetch');

const https = require('https');


const saltRounds = 13;


const urlGG = 'https://accounts.google.com/o/oauth2/v2/auth';
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri_client = 'https://localhost:3000/google/client-auth';
const redirect_uri_admin = 'https://localhost:3000/google/admin-auth';
const response_type = 'code';
const grant_type = 'authorization_code';
const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

exports.GoogleRedirect = (req, res) => {
    const { type } = req.params;
    let redirect_uri;

    if (type == 'admin') {
        redirect_uri = redirect_uri_admin;
    }
    else {
        redirect_uri = redirect_uri_client;
    }

    const queries = new URLSearchParams({
        response_type,
        redirect_uri,
        client_id,
        scope: scopes.join(' '),
        prompt: 'select_account'
    });

    res.redirect(`${urlGG}?${queries.toString()}`);
}

exports.GoogleClientAuth = async (req, res, next) => {
    try {
        const code = req.query.code;
        const options = {
            code,
            grant_type,
            client_id,
            client_secret,
            redirect_uri: redirect_uri_client,
            scope: scopes.join(' '),
            prompt: 'select_account'
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
        let user;
        if (decodedToken.sub != null) {
            user = await UserModel.getUserByGoogleID(decodedToken.sub);
        }

        if (!user) {
            user = {};
            user.GoogleID = decodedToken.sub;
            user.Username = null;
            user.GoogleName = userData.name;
            user.Password = null;
            user.Email = userData.email;
            const result = await UserModel.createAccount(user);
            if (result > 0) {
               
                user = await UserModel.getUserByUserID(result);
                const PAY_PORT = process.env.PAY_SERVER_PORT;
                const agent = new https.Agent({
                    rejectUnauthorized: false
                });

                const key = process.env.PRIVATE_KEY;
                const UserID = jwt.sign({ UserID: result }, key, { expiresIn: '1h' });
                const secret = jwt.sign({ secret: process.env.SERVER_SECRET }, key, { expiresIn: '1h' })

                await fetch(`https://localhost:${PAY_PORT}/createUser`, {
                    agent,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ UserID, secret }),
                });
            }

        }

        if (!user.Username) {
            user.Username = userData.name;
        }



        const key = process.env.PRIVATE_KEY;
        const token = jwt.sign(user, key, { expiresIn: '1h' });
        req.session.token = token;

        res.render('truePage', {
            layout: 'account-form',
            Username: user.Username,
            notification: 'Đăng nhập thành công'
        });


    }
    catch (error) {
        next(error);
    }
}

exports.GoogleAdminAuth = async (req, res, next) => {
    try {
        const code = req.query.code;
        const options = {
            code,
            grant_type,
            client_id,
            client_secret,
            redirect_uri: redirect_uri_admin,
            scope: scopes.join(' '),
            prompt: 'select_account'
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
        let user;
        if (decodedToken.sub !== null) {
            user = await UserModel.getUserByGoogleID(decodedToken.sub);
        }

        if (!user) {
            let _id = await UserModel.getIDInLastRow();

            res.render("addGGAccountsAdmin", {
                layout: 'admin',
                Username: req.Username,
                admin: true,
                title: "Thêm tài khoản Google",
                UserID: _id + 1,
                GoogleID: decodedToken.sub,
                GoogleName: userData.name,
                Email: userData.email
            });
        }
        else {
            res.render("errorPage", {
                layout: 'admin',
                Username: req.Username,
                admin: true,
                error: "Tài khoản đã tồn tại",
            });
        }
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
                const key = process.env.PRIVATE_KEY;

                const token = jwt.sign(user, key, { expiresIn: '1h' });

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

exports.CheckIDExists = async (req, res) => {

    const result = await UserModel.getUserByUserID(req.query.id);
    if (result != undefined) {
        return res.json({ result: 1 });
    }

    return res.json({ result: 0 });
}

exports.Signup = async (req, res, next) => {
    try {
        const userSign = (req.body);
        userSign.GoogleID = null;
        userSign.GoogleName = null;
        userSign.Password = await bcrypt.hash(userSign.Password, saltRounds);
        const createUserID = await UserModel.createAccount(userSign);
        if (createUserID > 0) {
            const PAY_PORT = process.env.PAY_SERVER_PORT;
            const agent = new https.Agent({
                rejectUnauthorized: false
            });

            const key = process.env.PRIVATE_KEY;
            const UserID = jwt.sign({ UserID: createUserID }, key, { expiresIn: '1h' });

            const secret = jwt.sign({ secret: process.env.SERVER_SECRET }, key, { expiresIn: '1h' })
            const _fetch = await fetch(`https://localhost:${PAY_PORT}/createUser`, {
                agent,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserID, secret }),
            });


            const resJson = await _fetch.json();
            const resStatus = resJson._status;
            if (!resStatus) {
                await UserModel.deleteUser({ UserID: createUserID });
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

                    notification: 'Đăng ký thành công'
                });
            }

        }
        else {
            res.render('errorPage', {
                layout: 'account-form',
                Username: req.Username,

                error: 'Đăng ký không thành công'
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

exports.GetProfile = async (req, res, next) => {
    const { page = 1, limit = 5 } = req.query;


    let { UserID = '', GoogleID = '', Balance = 0, Email = '' } = req.user;
    const Orders = await OrdersModel.getByUserID_Page(req.user.UserID, page, limit);
    const key = process.env.PRIVATE_KEY;
    let date;
    for (let order of Orders) {
        date = new Date(order.OrderDate);
        order.OrderDateToString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}-${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    const Topup = await TopupModel.getByUserID_Page(req.user.UserID, page, limit);


    for (let row of Topup) {
        date = new Date(row.TopUpDay);
        row.TopUpDayToString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}-${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    }
    let pages;
    if (Topup[0]?.Total != undefined && Orders[0]?.Total != undefined) {
        if (Topup[0]?.Total > Orders[0]?.Total) {
            pages = Array.from(
                { length: Math.ceil(Topup[0]?.Total / limit || 0) },
                (_, i) => i + 1
            );
        }
        else {
            pages = Array.from(
                { length: Math.ceil(Orders[0]?.Total / limit || 0) },
                (_, i) => i + 1
            );
        }
    }
    else {
        if (Topup[0]?.Total != undefined) {
            pages = Array.from(
                { length: Math.ceil(Topup[0]?.Total / limit || 0) },
                (_, i) => i + 1
            );
        }
        else {
            pages = Array.from(
                { length: Math.ceil(Orders[0]?.Total / limit || 0) },
                (_, i) => i + 1
            );
        }
    }


    UserID = jwt.sign({ UserID: req.user.UserID }, key, { expiresIn: '1h' });

    const PAY_PORT = process.env.PAY_SERVER_PORT;
    const agent = new https.Agent({
        //ca: process.env.KEY,
        rejectUnauthorized: false
    });

    const secret = jwt.sign({ secret: process.env.SERVER_SECRET }, key, { expiresIn: '1h' })
    const _fetch = await fetch(`https://localhost:${PAY_PORT}/getBalance`, {
        agent,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserID, secret }),
    });


    const resJson = await _fetch.json();
    if (resJson._status) {
        Balance = resJson._Balance;
    }

    res.render('profilePageClient', {
        layout: 'customer',
        Username: req.Username,
        UserID: req.user.UserID,
        GoogleID,
        Balance,
        Email,
        Orders,
        Topup,
        pages,
        title: 'Thông tin tài khoản'
    });
}

exports.getSearchAccounts = async (req, res) => {
    const { keyword = "", page = 1, limit = 5 } = req.query;

    const users = await UserModel.searchUser({
        AdminID: req.user.UserID,
        Keyword: keyword,
        Page: page,
        Limit: limit,
    });

    const pages = Array.from(
        { length: Math.ceil(users[0]?.Total / limit || 0) },
        (_, i) => i + 1
    );

    res.render("searchAccountsAdmin", {
        layout: 'admin',
        title: "Quản lý tài khoản",
        Username: req.Username,
        admin: true,
        users,
        pages,
        keyword,
    });
}

exports.deleteAccount = async (req, res) => {
    const userID = req.params;

    const PAY_PORT = process.env.PAY_SERVER_PORT;
    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    const key = process.env.PRIVATE_KEY;
    const _userID = jwt.sign(userID, key, { expiresIn: '1h' });
    const secret = jwt.sign({ secret: process.env.SERVER_SECRET }, key, { expiresIn: '1h' });

    const _fetch = await fetch(`https://localhost:${PAY_PORT}/deleteUser`, {
        agent,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: _userID, secret }),
    });


    const resJson = await _fetch.json();
    const resStatus = resJson._status;

    if (!resStatus) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi xóa dữ liệu.' });
    }
    else {
        res.status(200).json({ message: 'Dữ liệu đã được xóa thành công!' });
    }
}

exports.getEditAccount = async (req, res) => {
    const { userID } = req.params;
    const user = await UserModel.getUserByUserID(userID);

    res.render("editAccountsAdmin", {
        layout: 'admin',
        Username: req.Username,
        admin: true,
        title: "Chỉnh sửa tài khoản",
        user
    });
}

exports.editAccount = async (req, res) => {
    const { userID } = req.params;
    const user = await UserModel.getUserByUserID(parseInt(userID, 10));

    let _username = req.body.username;
    if (_username === "") {
        _username = null;
    }

    let _password;
    if (req.body.password !== undefined && req.body.password.length > 0) {
        _password = await bcrypt.hash(req.body.password, saltRounds);
    }
    else {
        _password = user.Password;
    }

    let inp = {};
    inp.userID = userID;
    inp._userID = req.body.userID;
    inp._username = _username;
    inp._password = _password;
    inp._email = req.body.email ?? user.Email;
    inp._balance = req.body.balance;


    const PAY_PORT = process.env.PAY_SERVER_PORT;
    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    const key = process.env.PRIVATE_KEY;
    const _input = jwt.sign(inp, key, { expiresIn: '1h' });
    const secret = jwt.sign({ secret: process.env.SERVER_SECRET }, key, { expiresIn: '1h' })

    const _fetch = await fetch(`https://localhost:${PAY_PORT}/editUser`, {
        agent,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: _input, secret }),
    });


    const resJson = await _fetch.json();
    const resStatus = resJson._status;

    if (!resStatus) {
        res.render("errorPage", {
            layout: 'admin',
            Username: req.Username,
            admin: true,
            error: "Chỉnh sửa thất bại",
        });
    }
    else {
        res.render("truePage", {
            layout: 'admin',
            Username: req.Username,
            admin: true,
            notification: "Chỉnh sửa thành công",
        });
    }
}

exports.getAddAccount = async (req, res) => {
    let _id = await UserModel.getIDInLastRow();

    res.render("addAccountsAdmin", {
        layout: 'admin',
        Username: req.Username,
        admin: true,
        title: "Thêm tài khoản",
        id: _id + 1
    });
}

exports.addAccount = async (req, res) => {
    let _username = req.body.username;
    if (_username === "") {
        _username = null;
    }

    let _password;
    if (req.body.password !== undefined && req.body.password.length > 0) {
        _password = await bcrypt.hash(req.body.password, saltRounds);
    }
    else {
        _password = null;
    }

    let user = {};
    user.UserID = req.body.userID;
    user.GoogleID = req.body.googleid ?? null;
    user.Username = _username;
    user.GoogleName = req.body.googlename ?? null;
    user.Password = _password;
    user.Email = req.body.email;

    const PAY_PORT = process.env.PAY_SERVER_PORT;
    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    const key = process.env.PRIVATE_KEY;
    const _user = jwt.sign(user, key, { expiresIn: '1h' });
    const secret = jwt.sign({ secret: process.env.SERVER_SECRET }, key, { expiresIn: '1h' })

    const _fetch = await fetch(`https://localhost:${PAY_PORT}/createUser`, {
        agent,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: _user, secret }),
    });


    const resJson = await _fetch.json();
    const resStatus = resJson._status;

    if (!resStatus) {
        res.render("errorPage", {
            layout: 'admin',
            Username: req.Username,
            admin: true,
            error: "Thêm tài khoản thất bại"
        });
    }
    else {
        res.render("truePage", {
            layout: 'admin',
            Username: req.Username,
            admin: true,
            notification: "Thêm tài khoản thành công"
        });
    }
}
