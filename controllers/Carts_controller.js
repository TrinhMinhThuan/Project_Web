
const CartModel = require('../models/Carts_model');
const ProductModel = require('../models/Products_model');
const UserModel = require('../models/Users_model');
const OrderModel = require('../models/Orders_model');
const OrderDetailModel = require('../models/Order_Detail_model');
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
    const key = process.env.PRIVATE_KEY;

    const UserID = jwt.sign({ UserID: req.user.UserID }, key, { expiresIn: '1h' });

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
    let Balance = 0;
    if (resJson._status)
    {
        Balance = resJson._Balance;
    }

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


        const cartOfUser = await CartModel.getByUserID(req.user.UserID);
        let TotalPriceAllItem = 0;
        let product = {};

        for (let cart of cartOfUser) {
            product = await ProductModel.getByProductID(cart.ProductID);
            if (product == undefined)
            {
                res.render( 'errorPage', { layout: 'customer', 
                Username: req.Username,
                    error: `Sản phẩm có ID ${cart.ProductID} không còn đã không còn kinh doanh nữa,
                     quý khách vui lòng xóa khỏi giỏ hàng để tiếp tục thục hiện giao dịch!` });
                     
                    return;
            }
            else if( product.StockQuantity < cart.Quantity)
            {
                
                res.render('errorPage', {layout: 'customer', 
                Username: req.Username,

                    error: `Sản phẩm ${product.ProductName} có số lượng tồn là ${product.StockQuantity}
                     nên không đủ để thục hiện giao dịch, quý khách vui lòng xóa khỏi giỏ hàng để tiếp tục thục hiện giao dịch!` });
                     return;
            }
        }

        for (let cart of cartOfUser) {
            product = await ProductModel.getByProductID(cart.ProductID);
            cart.ProductName = product.ProductName;
            cart.Price = product.Price;
            cart.Author = product.Author;
            cart.TotalPrice = product.Price * cart.Quantity;
            TotalPriceAllItem += cart.TotalPrice;
        }

        let Infor = {};
        const key = process.env.PRIVATE_KEY;

        Infor.UserID = req.user.UserID;
        const AdminAccount = await UserModel.getAdminUser();
        
        Infor.AdminID = AdminAccount.UserID;
        
        Infor.TotalPriceAllItem = TotalPriceAllItem;

        const Info = jwt.sign({ Infor }, key, { expiresIn: '1h' });

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
            body: JSON.stringify({ Info, secret }),
        });


        const resJson = await _fetch.json();

        if (resJson._status == false) {

            const OrderID = await OrderModel.create(req.user.UserID, TotalPriceAllItem, 'Failed'); //Tạo hóa đơn
            for (let cart of cartOfUser) {
                await OrderDetailModel.create(OrderID, cart.ProductID, cart.Quantity, cart.TotalPrice);
            }


            res.render('errorPage', {
                layout: 'customer',
                Username: req.Username,
                error: resJson._errorMsg
            });
        }
        else { // Trường hợp đã thành công

            await CartModel.deleteByUserID(req.user.UserID); // Xóa khỏi cart
            const OrderID = await OrderModel.create(req.user.UserID, TotalPriceAllItem, 'Success'); //Tạo hóa đơn
            for (let cart of cartOfUser) {
                await OrderDetailModel.create(OrderID, cart.ProductID, cart.Quantity, cart.TotalPrice);
                await ProductModel.updateStockQuantityByProductID(cart.ProductID, -cart.Quantity); // Update số lượng sản phẩm

            }

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
                    if (cart.Quantity + parseInt(quantity) > product.StockQuantity)
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