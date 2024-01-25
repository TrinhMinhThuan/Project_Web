
const UserModel = require('../models/Users_model');
const CartModel = require('../models/Carts_model');
const ProductModel = require('../models/Products_model');
const https = require('https');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

exports.LoadAllItemOfCart = async (req, res, next) => {

    // page
    const { page = 1, limit = 5 } = req.query;

    const _cartOfUser = await CartModel.getByUserID(req.user.UserID);
    let TotalPriceAllItem = 0;
    let product1 = {};
    for (let cart of _cartOfUser) {
        product1 = await ProductModel.getByProductID(cart.ProductID);
        if(product1){
            cart.TotalPrice = product1.Price * cart.Quantity;
            TotalPriceAllItem += cart.TotalPrice;
        }
    }

    const cartOfUser = await CartModel.getByUserID_Page(req.user.UserID, page, limit);
    let product = {};
    for (let cart of cartOfUser) {
        product = await ProductModel.getByProductID(cart.ProductID);
        if (product != undefined) {
            cart.ProductName = product.ProductName;
            cart.Price = product.Price;
            cart.Author = product.Author;
            cart.TotalPrice = product.Price * cart.Quantity;
        }
        else
        {
            cart.Price = 0;
            cart.TotalPrice = 0;
        }
    }

    const pages = Array.from(
        { length: Math.ceil(cartOfUser[0]?.Total / limit || 0) },
        (_, i) => i + 1
    );

    //console.log(cartOfUser[0]?.Total);
    const UserID = req.user.UserID;
    const temp = await UserModel.getUserByUserID(UserID);
    const Balance = temp.Balance;

    res.render('cartPageClient', {
        layout: 'customer',
        Username: req.Username,
        UserID: UserID,
        cart: cartOfUser,
        TotalPriceAllItem,
        pages,
        Balance,
        title: "Danh sách sản phẩm trong giỏ hàng"
    });
}




exports.Pay = async (req, res, next) => {

    try {
        const user = await UserModel.getUserByUserID(req.user.UserID);
        const BalanceClient = user.Balance;
        const admin = await UserModel.getAdminUser();
        const BalanceAdmin = admin.Balance;




        const key = process.env.PRIVATE_KEY;

        const UserID = jwt.sign({ UserID: user.UserID }, key, { expiresIn: '1h' });

        const PAY_PORT = process.env.PAY_SERVER_PORT;
        const agent = new https.Agent({
            //ca: process.env.KEY,
            rejectUnauthorized: false
        });

        const secret = jwt.sign({ secret: process.env.SERVER_SECRET }, key, { expiresIn: '1h' })
        const _fetch = await fetch(`https://localhost:${PAY_PORT}/pay`, {
            agent,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ UserID, secret }),
        });


        const resJson = await _fetch.json();

        if (resJson._status == false) {
            await UserModel.setBalanceByUserID(admin.UserID, BalanceAdmin);
            await UserModel.setBalanceByUserID(user.UserID, BalanceClient);
            res.render('errorPage', {
                layout: 'customer',
                Username: req.Username,
                error: resJson._errorMsg
            });
        }
        else {
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

    try {
        const UserID = req.user.UserID;

        const _Cart = await CartModel.getAll();
        const maxCartID = _Cart.reduce((max, obj) => (obj.CartID > max ? obj.CartID : max), _Cart[0].CartID);
        const { BookID } = req.params;
        const product = await ProductModel.getByProductID(BookID);
        
        const quantity = req.query.quantity;
        if (quantity <= product.StockQuantity) {
            let check = 0;
            for (let cart of _Cart) {
                if (BookID == cart.ProductID && UserID == cart.UserID) {
                    if (cart.Quantity + quantity > quantity)
                    {
                        res.render("errorPage", {
                            layout: 'customer',
                            Username: req.Username,
                            admin: false,
                            error: "Tổng số lượng trong giỏ hàng lớn hơn số lượng hàng cửa hàng hiện có",
                        });
                        return;
                    }
                    else
                    {
                        check = await CartModel.updateQuantityByCartID(cart.CartID, quantity);
                        break;
                    }
                    
                }

            }
            if (check === 0) {
                check = await CartModel.addCart({
                    BookID, quantity, UserID, maxCartID
                });
            }

            if (check !== 0) {
                res.render("truePage", {
                    layout: 'customer',
                    Username: req.Username,
                    admin: false,
                    notification: "Thêm sản phẩm giỏ hàng thành công"
                })
            }
            else {
                res.render("errorPage", {
                    layout: 'customer',
                    Username: req.Username,
                    admin: false,
                    error: "Thêm sản phẩm giỏ hàng không thành công",
                })
            }
        }
        else {
            res.render("errorPage", {
                layout: 'customer',
                Username: req.Username,
                admin: false,
                error: "Số lượng sản phẩm của cửa hàng hiện không đủ để thêm vào giỏ hàng",
            })
        }

    } catch (error) {
        next(error);
    }

}


exports.Delete = async (req, res, next) => {
    try {
        const ID = req.query.ID;
        const affect = await CartModel.deleteByCartID(ID);
        const totalItem = await CartModel.countCartByUserID(req.query.UserID);
        let page = req.query.page;
        if (totalItem % 5 === 0 && page != 1)
        {
            page -= 1;
        }
        res.redirect(`/cartBook?page=${page}`);
    } catch (error) {
        next(error);
    }


}