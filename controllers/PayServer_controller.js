
const jwt = require("jsonwebtoken");
const UserModel = require('../models/Users_model');
const CartModel = require('../models/Carts_model');
const ProductModel = require('../models/Products_model');
const OrderModel = require('../models/Orders_model');
const OrderDetailModel = require('../models/Order_Detail_model');

exports.createUser = async (req, res, next) => {
    try {
        const token = req.body;
        const key = process.env.PRIVATE_KEY;
        const secret = process.env.SERVER_SECRET;
        let decoded;
        jwt.verify(token.secret, key, function (err, _decoded) {
            if (err) {

                console.log("error");
                res.json({ _status: false });
            }
            else {
                decoded = _decoded.secret;
            }
        });
        
        if (decoded === secret) {
            jwt.verify(token.user, key, async function (_err, _decoded) {
                if (_err) {
                    console.log(_err);
                    res.json({ _status: false });
                }
                else {
                    //todo code
                    let create = await UserModel.createAccount(_decoded);
                    if (!create) {
                        res.json({ _status: false });
                    }
                    else {

                        res.json({ _status: true });
                    }
                }
            });
        }
        else {
            res.json({ _status: false });
        }




    } catch (error) {
        next(error);
        res.json({ _status: false });
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const token = req.body;
        const key = process.env.PRIVATE_KEY;
        const secret = process.env.SERVER_SECRET;
        let decoded;
        jwt.verify(token.secret, key, function (err, _decoded) {
            if (err) {
                console.log("error");
                res.json({ _status: false });
            }
            else {
                decoded = _decoded.secret;
            }
        });
        
        if (decoded === secret) {
            jwt.verify(token.userId, key, async function (_err, _decoded) {
                if (_err) {
                    console.log(_err);
                    res.json({ _status: false });
                }
                else {
                    //todo code
                    let deletee = await UserModel.deleteUser(_decoded);
                    if (!deletee) {
                        res.json({ _status: false });
                    }
                    else {
                        res.json({ _status: true });
                    }
                }
            });
        }
        else {
            res.json({ _status: false });
        }


    } catch (error) {
        next(error);
        res.json({ _status: false });
    }
}


exports.editUser = async (req, res, next) => {
    try {
        const token = req.body;
        const key = process.env.PRIVATE_KEY;
        const secret = process.env.SERVER_SECRET;
        let decoded;
        jwt.verify(token.secret, key, function (err, _decoded) {
            if (err) {

                console.log("error");
                res.json({ _status: false });
            }
            else {
                decoded = _decoded.secret;
            }
        });
        
        if (decoded === secret) {
            jwt.verify(token.input, key, async function (_err, _decoded) {
                if (_err) {
                    console.log(_err);
                    res.json({ _status: false });
                }
                else {
                    //todo code
                    let edit = await UserModel.editUser(_decoded);
                    if (!edit) {
                        res.json({ _status: false });
                    }
                    else {

                        res.json({ _status: true });
                    }
                }
            });
        }
        else {
            res.json({ _status: false });
        }


    } catch (error) {
        next(error);
        res.json({ _status: false });
    }
}


exports.Pay = async (req, res, next) => {
    try {
        const token = req.body;
        const key = process.env.PRIVATE_KEY;
        const secret = process.env.SERVER_SECRET;
        let decoded;
        let _UserID = -1;
        jwt.verify(token.secret, key, function (err, _decoded) {
            if (err) {

                console.log("error");
                res.json({ _status: false, _errorCode: 0,_errorMsg: 'Token không hợp lệ!' });
            }
            else {
                decoded = _decoded.secret;
            }
        });

        if (decoded === secret) {
            jwt.verify(token.UserID, key, function (_err, _decoded) {
                if (_err) {
                    console.log(_err);
                    res.json({ _status: false, _errorCode: 1, _errorMsg: 'Thông tin tài khoản có sai sót, vui lòng đăng nhập lại!' });
                }
                else {
                    //todo code

       
                    _UserID = _decoded.UserID;
                    
                }
            });
            if (_UserID > 0)
            {
                const cartOfUser = await CartModel.getByUserID(_UserID);

                    let TotalPriceAllItem = 0;
                    let product = {};

                    for (let cart of cartOfUser) {
                        product = await ProductModel.getByProductID(cart.ProductID);
                        if( product.StockQuantity < cart.Quantity)
                        {
                            res.json({ _status: false, _errorCode: 14, 
                                _errorMsg: `Sản phẩm ${product.ProductName} có số lượng tồn là ${product.StockQuantity}
                                 nên không đủ để thục hiện giao dịch, quý khách vui lòng xóa khỏi giỏ hàng để tiếp tục thục hiện giao dịch!` });
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
                    const user = await UserModel.getUserByUserID(_UserID);
                    if (user.Balance < TotalPriceAllItem)
                    {
                        res.json({ _status: false, _errorCode: 3,_errorMsg: 'Tài khoản quý khách không đủ để thanh toán, vui lòng nạp thêm để thực hiện thanh toán' });

                    }
                    else
                    {
                        //Updete số tiền
                        await UserModel.updateBalanceById(_UserID, -TotalPriceAllItem);
                        const adminAccount = await UserModel.getAdminUser();
                        await UserModel.updateBalanceById(adminAccount.UserID, TotalPriceAllItem);

                        //Xóa khỏi gỏ hàng
                        await CartModel.deleteByUserID(_UserID);
                        const OrderID = await OrderModel.create(_UserID, TotalPriceAllItem);
                        for (let cart of cartOfUser)
                        {
                            await OrderDetailModel.create(OrderID, cart.ProductID, cart.Quantity, cart.TotalPrice);
                            await ProductModel.updateStockQuantityByProductID(cart.ProductID, -cart.Quantity);                           
                            
                        }
                        res.json({_status: true});
                    }
            }
            else
            {
                res.json({ _status: false, _errorCode: 1, _errorMsg: 'Thông tin tài khoản có sai sót, vui lòng đăng nhập lại!' });
                
            }
        }
        else {
            res.json({ _status: false, _errorCode: 2, _errorMsg: 'Lỗi kết nối xác thực hệ thống!'  });
        }




    } catch (error) {
        next(error);
        res.json({ _status: false, _errorCode: -1, _errorMsg: 'Giao dịch không thành công, do vấn đề liên kết hệ thống, vui lòng đăng nhập lại!' });
    }
}

