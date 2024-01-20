
const UserModel = require('../models/Users_model');


exports.createUser = async (req, res, next) =>{
    try {
        const user = req.body;
        
        let create = await UserModel.createAccount(user);
        if (!create) {
            

            res.json({_status: false});
        }
        else {
            
            res.json({_status: true});
        }

        res.json({_status: true});
    } catch (error) {
        next(error);
    }
}
