
const OrderDetailModel = require('../models/Order_Detail_model');
const ProductModel = require('../models/Products_model');


exports.orderDetail = async (req, res, next) => {
    const {page = 1, limit = 5} = req.query;
    
    const _orderDetail = await  OrderDetailModel.getByOrderID(req.query.ID);
    let TotalPriceAllItem = 0;
    for (let detail of _orderDetail) {
        TotalPriceAllItem += detail.Price * detail.Quantity;
    }
    
    const orderDetail = await  OrderDetailModel.getByOrderID_Page(req.query.ID, page, limit);

    let product = {};
    for (let detail of orderDetail) {
        product = await ProductModel.getByProductID(detail.ProductID);
        detail.PriceOne = detail.Price;
        if (product)
        {
            detail.ProductName = product.ProductName;
            detail.Author = product.Author;
            detail.TotalAmout = detail.PriceOne * detail.Quantity;
        }
    }

    const pages = Array.from(
        { length: Math.ceil(orderDetail[0]?.Total / limit || 0) },
        (_, i) => i + 1
      );

    res.render('orderDetailPage', {
        layout: 'customer',
        Username: req.Username,
        orderDetail,
        TotalPriceAllItem,
        pages,
        title: "Thông tin chi tiết hóa đơn"
    });


}


