const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/Users_model');
const OrdersModel = require ('../models/Orders_model');
const OrderDetailModel = require('../models/Order_Detail_model');
const TopupModel = require('../models/TopUp_model'); 
const fetch = require('node-fetch');

const https = require('https');


const saltRounds = 13;


const urlGG = 'https://accounts.google.com/o/oauth2/v2/auth';
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'https://localhost:3000/google/auth';
const response_type = 'code';
const grant_type = 'authorization_code';
const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

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
        let user;
        if (decodedToken.sub !== null) {
            user = await UserModel.getUserByGoogleID(decodedToken.sub);
        }

        // console.log(userData);
        if (!user) {
            user = {};
            user.GoogleID = decodedToken.sub;
            user.Username = null;
            user.GoogleName = userData.name;
            user.Password = null;
            user.Email = userData.email;
            const PAY_PORT = process.env.PAY_SERVER_PORT;
            const agent = new https.Agent({
                rejectUnauthorized: false
            });

            const key = process.env.PRIVATE_KEY;
            const _user = jwt.sign(user, key, { expiresIn: '1h' });
            const secret = jwt.sign({ secret: process.env.SERVER_SECRET }, key, { expiresIn: '1h' })
           
            await fetch(`https://localhost:${PAY_PORT}/createUser`, {
                agent,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: _user, secret }),
            });
        }

        if(!user.Username)
        {
            user.Username = userData.name;
        }
    
        const key = process.env.PRIVATE_KEY;
        const token = jwt.sign(user, key, { expiresIn: '1h' });
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
        const PAY_PORT = process.env.PAY_SERVER_PORT;
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        const key = process.env.PRIVATE_KEY;
        const user = jwt.sign(userSign, key, { expiresIn: '1h' });

        const secret = jwt.sign({ secret: process.env.SERVER_SECRET }, key, { expiresIn: '1h' })
        const _fetch = await fetch(`https://localhost:${PAY_PORT}/createUser`, {
            agent,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, secret }),
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

                notification: 'Đăng ký thành công'
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
    let { UserID = '', GoogleID = '', Balance = 0, Email = '' } = req.user;
    const Orders = await OrdersModel.getByUserID(req.user.UserID);
    let date;
    for (let order of Orders)
    {
        date = new Date(order.OrderDate);
        order.OrderDateToString = `${date.getDay()}-${date.getMonth()+1}-${date.getFullYear()}`;
    }
    

    const Topup = await TopupModel.getByUserID(req.user.UserID);

    for (let row of Topup)
    {
        date = new Date(row.TopUpDay);
        row.TopUpDayToString = `${date.getDay()}-${date.getMonth()+1}-${date.getFullYear()}`;
    }

    res.render('profilePageClient', {
        layout: 'customer',
        Username: req.Username,
        UserID,
        GoogleID,
        Balance,
        Email,
        Orders,
        Topup,
        title: 'Thông tin tài khoản'
    });
}

exports.getSearchAccounts = async (req, res) => {
    // console.log(req.user);
    // req.user.UserID
    // console.log(req);

  const { keyword = "", page = 1, limit = 2 } = req.query;

  const users = await UserModel.searchUser({
    AdminID: req.user.UserID,
    Keyword: keyword,
    Page: page,
    Limit: limit,
  });

//   users.forEach((user) => {
//     if (user.GoogleID !== null) {
//       doiTuong.B = 1;
//     } else {
//       doiTuong.B = 0;
//     }
//   });

//   console.log(users);

  const pages = Array.from(
    { length: Math.ceil(users[0]?.Total / limit || 0) },
    (_, i) => i + 1
  );

  res.render("searchAccountAdmin", {
    layout: 'admin',
    title: "Quản lý tài khoản",
    Username: req.Username,
    admin: true,
    users,
    pages,
    keyword,
    total: users[0]?.Total ?? 0
  });
}

exports.deleteAccount = async (req, res) => {
    const { userID } = req.params;

    try {
        await UserModel.deleteUser(userID);
    } catch (error) {
        res.render("errorPage",{
            layout: 'admin',
            Username: req.Username,
            admin: true,
            error: "Có lỗi xảy ra khi xóa dữ liệu.",
        })
    } 
}


exports.getEditAccount = async (req, res) => {
    const { userID } = req.params;
    const user = await UserModel.getUserByUserID(userID);
    
    res.render("editUserAdmin", {
        layout: 'admin',
        title: "Chỉnh sửa tài khoản",
        user
    });

    // let renderPage;
    // if(user.GoogleID == null)
    // {
    //     renderPage = "editNormalUser";
    // }
    // else
    // {
    //     renderPage = "editGoogleUser";
    // }


    // const _userID = user.UserID;
    // const _GoogleID = user.GoogleID;
    // const _username = user.Username;
    // const _GoogleName = user.GoogleName;
    // const _email = user.Email;
    // const _balance = user.Balance;

    // // Account edit
    // const { userID, username} = req.query;
  
    // // Check UserID
    // if (categoryID !== undefined && categoryID != categoryId) {
    //   const checkID = await Categories.checkID(categoryID);
    //   if (checkID == true) {
    //     res.render("errorPage", {
    //       layout: 'admin',
    //       error: "Đã tồn tại ID",
    //     });
    //   }
    // }
    // if(categoryID == categoryId && categoryName == categoryname){
    //   console.log("testttttttttttttttttttt");
    //   res.render("errorPage", {
    //     layout: 'admin',
    //     admin: true,
    //     error: "Không có sự thay đổi",
    //   });
    // }
    // else if(categoryID !== undefined && categoryName !== undefined) {
    //   let query = `UPDATE Categories SET `;
    //   let checkdot = false;
    //   if (categoryID != categoryid) {
    //     query = query + `CategoryID = @categoryId `;
    //     checkdot = true;
    //   }
    //   if (categoryName != categoryname) {
    //     if (checkdot == true) query = query + `,`;
    //     query = query + `CategoryName = @categoryName `;
    //     checkdot = true;
    //   }
    //   // if (categoryQuantity != categoryquantity) {
    //   //   if (checkdot == true) query = query + `,`;
    //   //   query = query + `CategoryQuantity = @categoryQuantity `;
    //   //   checkdot = true;
    //   // }
    //   query = query + `Where CategoryID = ${categoryid}`;
    //   const temp = await Categories.edit({
    //     ID: categoryID,
    //     Name: categoryName,
    //     //Quantity: categoryQuantity,
    //     Query: query
    //   });
    //   if (temp) {
    //     res.render("truePage", {
    //       layout: 'admin',
    //       admin: true,
    //       notification: "Chỉnh sửa thành công",
    //     });
    //   }
    //   else {
    //     res.render("errorPage", {
    //       layout: 'admin',
    //       admin: true,
    //       error: "Chỉnh sửa thất bại",
    //     });
    //   }
    // } else {
        
    // }
}

exports.editAccount = async (req, res) => {
    // console.log(req.body);
    const { userID } = req.params;
    const user = await UserModel.getUserByUserID(userID);
    // console.log(req.user);

    let _username = req.body.username;
    if(_username === "")
    {
        _username = null;
    }

    let _password;
    if (req.body.password !== undefined && req.body.password.length > 0)
    {
        _password = await bcrypt.hash(req.body.password, saltRounds);
    }
    else
    {
        _password = user.Password;
    }

    const check = await UserModel.editUser({
        userID,
        _userID: req.body.userID,
        _username,
        _password,
        _email: req.body.email??user.Email,
        _balance: req.body.balance
    });

    if (check) {
        res.render("truePage", {
            layout: 'admin',
            Username: req.Username,
            admin: true,
            notification: "Chỉnh sửa thành công",
        });
        }
        else {
        res.render("errorPage", {
            layout: 'admin',
            Username: req.Username,
            admin: true,
            error: "Chỉnh sửa thất bại",
        });
    }
}
  