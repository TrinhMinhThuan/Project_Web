
const UserModel = require('../models/Users_model');
const CartModel = require('../models/Carts_model');
const ProductModel = require('../models/Products_model');
const https = require('https');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

exports.LoadAllItemOfCart = async (req, res, next) => {
    const cartOfUser = await CartModel.getByUserID(req.user.UserID);
    let TotalPriceAllItem = 0;
    let product = {};
    for (let cart of cartOfUser) {
        product = await ProductModel.getByProductID(cart.ProductID);
        if (product)
        {
            cart.ProductName = product.ProductName;
            cart.Price = product.Price;
            cart.Author = product.Author;
            cart.TotalPrice = product.Price * cart.Quantity;
            TotalPriceAllItem += cart.TotalPrice;
        }

    }
    const  UserID = req.user.UserID;
    const temp = await UserModel.getUserByUserID(UserID);

    const Balance = temp.Balance;

    res.render('cartPageClient', {
        layout: 'customer',
        Username: req.Username,
        UserID: UserID,
        cart: cartOfUser,
        TotalPriceAllItem,
        Balance,
        title: "Danh sách sản phẩm trong giỏ hàng"
    });
}




exports.Pay = async (req, res, next) => {

    try {
        const user = req.user;
        const BalanceClient = user.Balance;
        const admin = await UserModel.getAdminUser();
        const BalanceAdmin = admin.Balance;
        
        
        const key = process.env.PRIVATE_KEY;

        const UserID = jwt.sign({UserID: user.UserID}, key, { expiresIn: '1h'});

        const PAY_PORT = process.env.PAY_SERVER_PORT;
        const agent = new https.Agent({
            //ca: process.env.KEY,
            rejectUnauthorized: false
        });

        const secret = jwt.sign({secret: process.env.SERVER_SECRET}, key, { expiresIn: '1h' })
        const _fetch = await fetch(`https://localhost:${PAY_PORT}/pay`, {
            agent,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({UserID, secret}),
        });


        const resJson = await _fetch.json();

        if (resJson._status == false)
        {
            await UserModel.setBalanceByUserID(admin.UserID, BalanceAdmin);
            await UserModel.setBalanceByUserID(user.UserID, BalanceClient);
            res.render('errorPage', {
                layout: 'customer',
                Username: req.Username,
                error: resJson._errorMsg
            });
        }
        else
        {
            res.render('truePage', {
                Username: req.Username,
                layout: 'customer',
                notification: 'Thanh toán thành công'
            });
        }

    } catch (error) {
        next(error);
    }

}



exports.addCart = async (req, res, next) => {

    const UserID = req.user.UserID;
    const _Cart = await  CartModel.getAll();
    const maxCartID = _Cart.reduce((max, obj) => (obj.CartID > max ? obj.CartID : max), _Cart[0].CartID);
    const { BookID } = req.params;
    const quantity = req.query.quantity;
    const check = await CartModel.addCart({
        BookID,quantity, UserID, maxCartID
    });

    if(check){
        res.render("truePage",{
            layout: 'customer',
            Username: req.Username,
            admin: false,
            notification: "Thêm giỏ hàng thành công"
        })
    }
    else{
        res.render("errorPage",{
            layout: 'customer',
            Username: req.Username,
            admin: false,
            error: "Thêm giỏ hàng không thành công",
        })
    }
}


exports.Delete = async (req, res, next) => {
    try {
        const ID = req.query.ID;
        const affect = await CartModel.deleteByCartID(ID);
        res.redirect('/cartBook');
    } catch (error) {
        next(error);
    }
    

}