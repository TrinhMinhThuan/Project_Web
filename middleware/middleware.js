const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.session.token;
    //console.log(token);
    jwt.verify(token, 'hhh', function(err, decoded) {
        if (err) {
          //console.log(err);
          res.render('errorPage', {error: 'Bạn phải đăng nhập để thực hiện chức năng này'})
        }
        else
        {
            req.user = decoded;
            next();
        }
      });
};
