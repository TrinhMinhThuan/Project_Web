
const jwt = require("jsonwebtoken");
const UserModel = require('../models/Users_model');

const PaymentAccountModel = require('../models/PaymentAccount_model');

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
            jwt.verify(token.UserID, key, async function (_err, _decoded) {
                if (_err) {
                    console.log(_err);
                    res.json({ _status: false });
                }
                else {
                    //todo code
                    let createPay = await PaymentAccountModel.createPaymentAccountByUserID(_decoded.UserID);
                    if (!createPay) {
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
        let _AdminID = -1;
        let TotalPriceAllItem = 0;
        let PaymentAdmin = {}; 
        let BalanceAdmin = 0;
        let PaymentClient = {};   
        let BalanceClient = 0;
        jwt.verify(token.secret, key, function (err, _decoded) {
            if (err) {

                console.log("error");
                res.json({ _status: false, _errorCode: 0, _errorMsg: 'Token không hợp lệ!' });
            }
            else {
                decoded = _decoded.secret;
            }
        });

        if (decoded === secret) {
            jwt.verify(token.Info, key, function (_err, _decoded) {
                if (_err) {
                    console.log(_err);

                    res.json({ _status: false, _errorCode: 1, _errorMsg: 'Thông tin tài khoản có sai sót, vui lòng đăng nhập lại!' });
                }
                else {
                    
                    _UserID = _decoded.Infor.UserID;
                    _AdminID = _decoded.Infor.AdminID;
                    TotalPriceAllItem = _decoded.Infor.TotalPriceAllItem;
                  
                }
            });
            
            if (_UserID > 0 && _AdminID > 0) {

                PaymentAdmin =  await PaymentAccountModel.getAccountByUserID(_AdminID);
                BalanceAdmin =  PaymentAdmin.Balance;
                PaymentClient = await PaymentAccountModel.getAccountByUserID(_UserID);
                BalanceClient = PaymentClient.Balance;

                
                if (PaymentClient.Balance < TotalPriceAllItem) {
                    await PaymentAccountModel.setBalanceByUserID(PaymentAdmin.UserID, BalanceAdmin);
                    await PaymentAccountModel.setBalanceByUserID(PaymentClient.UserID, BalanceClient);
                    res.json({ _status: false, _errorCode: 3, _errorMsg: 'Tài khoản quý khách không đủ để thanh toán, vui lòng nạp thêm để thực hiện thanh toán' });

                }
                else {
                    //Updete số tiền
                    await PaymentAccountModel.updateBalanceById(_UserID, -TotalPriceAllItem);
                    await PaymentAccountModel.updateBalanceById(_AdminID, TotalPriceAllItem);

                    //Xóa khỏi gỏ hàng
                   
                    res.json({ _status: true });
                }
            }
            else {
                await PaymentAccountModel.setBalanceByUserID(PaymentAdmin.UserID, BalanceAdmin);
                await PaymentAccountModel.setBalanceByUserID(PaymentClient.UserID, BalanceClient);
                res.json({ _status: false, _errorCode: 1, _errorMsg: 'Thông tin tài khoản có sai sót, vui lòng đăng nhập lại!' });

            }
        }
        else {
            await PaymentAccountModel.setBalanceByUserID(PaymentAdmin.UserID, BalanceAdmin);
            await PaymentAccountModel.setBalanceByUserID(PaymentClient.UserID, BalanceClient);
            res.json({ _status: false, _errorCode: 2, _errorMsg: 'Lỗi kết nối xác thực hệ thống!' });
        }




    } catch (error) {
        next(error);
        res.json({ _status: false, _errorCode: -1, _errorMsg: 'Giao dịch không thành công, do vấn đề liên kết hệ thống, vui lòng đăng nhập lại!' });
    }
}





exports.GetBalance = async (req, res, next) => {
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
            jwt.verify(token.UserID, key, async function (_err, _decoded) {
                if (_err) {
                    console.log(_err);
                    res.json({ _status: false });
                }
                else {
                    //todo code

                    let Account = await PaymentAccountModel.getAccountByUserID(_decoded.UserID);
                    if (Account && Account.Balance) {
                        res.json({ _status: true, _Balance: Account.Balance });

                    }
                    else {
                        res.json({ _status: false });
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

exports.Topup = async (req, res, next) => {
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
                    //todo 

                    const result = await PaymentAccountModel.updateBalanceById(_decoded.UserID, _decoded.Amount);

                    if (result) {
                        res.json({ _status: true });
                    }
                    else {

                        res.json({ _status: false });
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