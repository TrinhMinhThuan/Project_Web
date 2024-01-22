const Book = require('../models/Products_model');

exports.getSearchBook = async (req, res, next) => {
 
    let { keyword = "", minPrice = "", maxPrice = "", type = "ProductName", page = 1, limit = 4 } = req.query;
    keyword = decodeURIComponent(keyword);
    const _books = await Book.search({
        Keyword: keyword,
        Page: page,
        Limit: limit,
        Type: type,
    });

    const pages = Array.from(
        { length: Math.ceil(_books[0]?.Total / limit || 0) },
        (_, i) => i + 1
      );
    res.render("searchBookAdmin",{
        layout: 'admin',
        title: "Quản lý sản phẩm",
        _books,
        pages,
        keyword: keyword,
        genre : type,
    })
}
exports.getSearchBook_client = async (req, res, next) => {
    let { keyword = "", minPrice = "", maxPrice = "", type = "ProductName", page = 1, limit = 4 } = req.query;
    keyword = decodeURIComponent(keyword);
    const _books = await Book.search({
        Min: minPrice,
        Max: maxPrice,
        Keyword: keyword,
        Page: page,
        Limit: limit,
        Type: type,
    });

    // Check giá max có nhỏ hơn giá min
    if (maxPrice < minPrice) {
        res.render("errorPage", {
            layout: 'customer',
            admin: false,
            error: "Lỗi: Giá Max nhỏ hơn giá Min",
        });
    }

    const pages = Array.from(
        { length: Math.ceil(_books[0]?.Total / limit || 0) },
        (_, i) => i + 1
    );

    // Chuyển số sang dạng dấu .
    for (var i = 0; i < _books.length; i++) {
        _books[i].Price = _books[i].Price.toLocaleString('vi-VN') + ' đ';
    }
    res.render("searchBookClient", {
        layout: 'customer',
        title: "Tìm kiếm sản phẩm",
        _books,
        pages,
        Username: req.Username,
        MinPrice: minPrice,
        MaxPrice: maxPrice,
        keyword: keyword,
        genre: type,
    })
}
