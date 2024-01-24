
const OrderDetailModel = require('../models/Order_Detail_model');
const ProductModel = require('../models/Products_model');


exports.orderDetail = async (req, res, next) => {
    const orderDetail = await  OrderDetailModel.getByOrderID(req.query.ID);
    let TotalPriceAllItem = 0;
    let product = {};
    for (let detail of orderDetail) {
        product = await ProductModel.getByProductID(detail.ProductID);
        if (product)
        {
            detail.ProductName = product.ProductName;
            detail.PriceOne = product.Price;
            detail.Author = product.Author;
            TotalPriceAllItem += detail.Price;
        }

    }


    res.render('orderDetailPage', {
        layout: 'customer',
        Username: req.Username,
        orderDetail,
        
        TotalPriceAllItem,
        
        title: "Thông tin chi tiết hóa đơn"
    });


}


