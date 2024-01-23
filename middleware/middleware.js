const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.session.token;
  //console.log(token);
  const key = process.env.PRIVATE_KEY;

  jwt.verify(token, key, function (err, decoded) {
    if (err) {

      res.render('errorPage', {
        layout: 'customer',
        error: 'Bạn phải đăng nhập vào tài khoản để thực hiện chức năng này'
      })
    }
    else {
      req.Username = decoded.Username;
      req.user = decoded;
      next();
    }
  });
};


exports.isLogin = (req, res, next) => {
  const token = req.session.token;
  const key = process.env.PRIVATE_KEY;
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

exports.authenticateAdmin = (req, res, next) => {
  const token = req.session.token;
  const key = process.env.PRIVATE_KEY;
  jwt.verify(token, key, function (err, decoded) {
    if (err) {

      res.render('errorPage', {
        layout: 'account-form',
        error: 'Bạn phải đăng nhập vào tài khoản admin để thực hiện chức năng này'
      })
    }
    else {

      const role = decoded.Role;
      if (role === 'Admin') {
        req.Username = decoded.Username;
        req.user = decoded;
        next();
      }
      else {
        res.render('errorPage', {
          layout: 'account-form',
          error: 'Bạn phải đăng nhập vào tài khoản admin để thực hiện chức năng này'
        })
      }

    }
  });
}




