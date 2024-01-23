const Book = require('../models/Products_model');
const Categories = require('../models/Categories_model');

//admin
exports.getSearchBook = async (req, res, next) => {

    const { keyword = "", minPrice = "", maxPrice = "", type = "ProductName", page = 1, limit = 4 } = req.query;
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
            layout: 'admin',
            admin: true,
            Username: req.Username,
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
    res.render("searchBookAdmin", {
        layout: 'admin',
        title: "Quản lý sản phẩm",
        _books,
        Username: req.Username,
        pages,
        MinPrice: minPrice,
        MaxPrice: maxPrice,
        keyword: keyword,
        genre: type,
    })
}

exports.editBook = async (req, res, next) => {
    // console.log(req.file);
    const { productId } = req.params;
    const _product = await Book.getByProductID(productId)

    const { newProductID = "", productName = "",
        categoryId = "", stockquantity = "", author = "", publishedyear = "", price = ""
    } = req.body;
    let newImage = "";
    if (req.file !== undefined && req.file.filename !== undefined) {
        newImage = req.file.filename;
    }
    const newProduct = {
        newImage, newProductID, productName, categoryId, stockquantity, author, publishedyear, price
    }

    if (productId != newProductID) {
        const checkID = await Book.checkID(newProductID)
        if (checkID) {
            res.render("errorPage", {
                layout: 'admin',
                error: "Đã tồn tại mã sách",
                Username: req.Username,
            });
        }
    }
    if (newImage != "" && newProductID != "" && productName != "" &&
        categoryId != "" && stockquantity != "" && author != "" &&
        publishedyear != "" && price != "") {
        const checkEdit = await Book.edit(_product, newProduct)
        if (checkEdit == false) {
            res.render("errorPage", {
                layout: 'admin',
                error: "Không có thay đổi",
                admin: true,
                Username: req.Username,
            });
        }
        else {
            res.render("truePage", {
                layout: 'admin',
                error: "Cập nhật sách thành công",
                admin: true,
                Username: req.Username,
            });
        }
    }
    const _genre = await Categories.getAll()
    res.render("editBooksAdmin", {
        layout: 'admin',
        title: "Chỉnh sửa sản phẩm",
        _product,
        _genre,
        Username: req.Username,
        productId,
    })
}
exports.addBook = async (req, res, next) => {

    const { newProductID = "", productName = "",
        categoryId = "", stockquantity = "", author = "", publishedyear = "", price = ""
    } = req.body;
    let newImage = "";
    if (req.file !== undefined && req.file.filename !== undefined) {
        newImage = req.file.filename;
    }
    const newProduct = {
        newImage, newProductID, productName, categoryId, stockquantity, author, publishedyear, price
    }

    const checkID = await Book.checkID(newProductID)
    if (checkID) {
        res.render("errorPage", {
            layout: 'admin',
            error: "Đã tồn tại mã sách",
            Username: req.Username,
        });
    }
    else if (newImage != "" && newProductID != "" && productName != "" &&
        categoryId != "" && stockquantity != "" && author != "" &&
        publishedyear != "" && price != "") {
        const checkAdd = await Book.add(newProduct)
        if (checkAdd == false) {
            res.render("errorPage", {
                layout: 'admin',
                error: "Thêm sản phẩm không thành công",
                Username: req.Username,
                admin: true,
            });
        }
        else {
            res.render("truePage", {
                layout: 'admin',
                error: "Thêm sách thành công",
                Username: req.Username,
                admin: true,
            });
        }
    }
    const _genre = await Categories.getAll()
    res.render("addBookAdmin", {
        layout: 'admin',
        title: "Thêm sản phẩm",
        Username: req.Username,
        _genre,
    })
}

//client
exports.getSearchBook_client = async (req, res, next) => {
    const { keyword = "", minPrice = "", maxPrice = "", type = "ProductName", page = 1, limit = 4 } = req.query;
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
            Username: req.Username,
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
        Username: req.Username,
        _books,
        pages,
        Username: req.Username,
        MinPrice: minPrice,
        MaxPrice: maxPrice,
        keyword: keyword,
        genre: type,
    })
}
