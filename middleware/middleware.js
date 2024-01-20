const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.session.token;
    //console.log(token);
    const key = process.env.KEY;

    jwt.verify(token, key, function(err, decoded) {
        if (err) {
          //console.log(err);
          res.render('errorPage', {
             layout: 'account-form',
            error: 'Bạn phải đăng nhập để thực hiện chức năng này'})
        }
        else
        {
            req.user = decoded;
            next();
        }
      });
};


exports.isLogin = (req, res, next) => {
    const token = req.session.token;
  
    jwt.verify(token, key, function (err, decoded) {
      if (err) {
        req.Username = 'Bạn chưa đăng nhập'
        next();
      }
      else {
        req.Username = decoded.Username;
        
        next();
      }
    });
  }
  
