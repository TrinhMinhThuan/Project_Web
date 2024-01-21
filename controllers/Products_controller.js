const Book = require('../models/Products_model');

exports.getSearchBook = async (req, res, next) => {
    const { keyword = "", type = "ProductName", page = 1, limit = 4 } = req.query;
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