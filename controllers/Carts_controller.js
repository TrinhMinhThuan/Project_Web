

const CartModel = require('../models/Carts_model');
const ProductModel = require('../models/Products_model');

exports.LoadAllItemOfCart = async (req, res, next) => {
    const cartOfUser = await CartModel.getByUserID(req.user.UserID);
    let TotalPriceAllItem = 0;
    let product = {};
    for (let cart of cartOfUser) {
        product = await ProductModel.getByProductID(cart.ProductID);

        cart.ProductName = product.ProductName;
        cart.Price = product.Price;
        cart.Author = product.Author;
        cart.TotalPrice = product.Price * cart.Quantity;
        TotalPriceAllItem += cart.TotalPrice;
    }

    res.render('cartPageClient', {
        layout: 'customer',
        Username: req.Username,
        UserID: (cartOfUser.length > 0) ? cartOfUser[0].UserID : null,
        cart: cartOfUser,
        TotalPriceAllItem,
        title: "Danh sách sản phẩm trong giỏ hàng"
    });
}


exports.Pay = async (req, res, next) => {

    try {
        const user = req.user;

        const PAY_PORT = process.env.PAY_SERVER_PORT;
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        const _fetch = await fetch(`https://localhost:${PAY_PORT}/pay`, {
            agent,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });


        const resJson = await _fetch.json();
        console.log(resJson);
    } catch (error) {
        next(error);
    }

}