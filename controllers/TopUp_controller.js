
const TopupModel = require('../models/TopUp_model');
const UserModel = require('../models/Users_model');
exports.Topup = async (req, res, next) => {

    try {
        const Amount = req.body.Amount;
        const UserID = req.user.UserID;
       
        const result = await TopupModel.create(UserID, Amount);
  
        if (result > 0)
        {
            await UserModel.updateBalanceById(UserID, Amount);
            res.render('truePage', {
                layout: 'customer',
                Username: req.Username,

                notification: 'Nạp tiền thành công'
            });
        }
        else
        {
            res.render('errorPage', {
                layout: 'customer',
                Username: req.Username,
    
                error: 'Nạp tiền không thành công, vui lòng thử lại'
            });
        }
    } catch (error) {
        res.render('errorPage', {
            layout: 'customer',
            Username: req.Username,

            error: 'Nạp tiền không thành công, vui lòng thử lại'
        });
    }
  
    

}



