const Book = require('../models/Products_model');
const Categories = require('../models/Categories_model');
const Order_Detail = require('../models/Order_Detail_model');
const Orders = require('../models/Orders_model');
//admin
exports.getSearchBook = async (req, res, next) => {

    const { keyword = "", minPrice = "", maxPrice = "", category = 0,type = "ProductName", page = 1, limit = 4 } = req.query;
    const categories = await Categories.getAll();
    const _books = await Book.search({
        Min: minPrice,
        Max: maxPrice,
        Keyword: keyword,
        Page: page,
        Limit: limit,
        Type: type,
        Category: category
    });
    
    const _preview = await Book.search({
        Min: minPrice,
        Max: maxPrice,
        Keyword: keyword,
        Page: 1,
        Limit: limit,
        Type: type,
        Category: category
    });

    // Check giá max có nhỏ hơn giá min
    if (maxPrice < minPrice) {
        res.render("errorPage", {
            layout: 'admin',
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

    if (_preview[0]?.Total/4 < req.query.page && _preview[0].Total % 4 === 0)
    {
        res.redirect(`/admin/?page=1&keyword=${keyword}&type=${type}`);
        
    }
    else
    {
        res.render("searchBookAdmin", {
            layout: 'admin',
            title: "Tìm kiếm sản phẩm",
            Username: req.Username,
            _books,
            pages,
            categories,
            Username: req.Username,
            MinPrice: minPrice,
            MaxPrice: maxPrice,
            keyword: keyword,
            genre: type,
        })
    }
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
            if(_product.CategoryID != newProductID){
                // Giảm số lượng sách của thể loại cũ, tăng thêr loại mới
                await Categories.updateCategoryQuantity(newProductID);
                await Categories.update_CategoryQuantity(CategoryID);
            }
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
    console.log(123);
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
            //Tăng số lượng sách trong thể loại lên + 1
            await Categories.updateCategoryQuantity(categoryId)
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
exports.salesRevenue = async(req,res,next) =>{
    res.render("salesRevenuePageAdmin", {
        layout: 'admin',
        admin: true,
        title: "Doanh thu sản phẩm",
        Username: req.Username,
    });
}
exports.getStatisticalData = async(req,res,next) =>{
    const yearYear = req.query.year;
    const yearMonth = req.query.year1;

    const currentYear = new Date().getFullYear();
    // Lấy dữ liệu 
    const _data = await Orders.getStatisticalData(yearYear, yearMonth)
    const newDataObject = {
        labels: [],
        data: []
    };
    //console.log(_data, yearYear, yearMonth);
    if(yearMonth != undefined){     //Thống kê theo các tháng trong năm
        var count = 0;
        for(var i = 1 ; i <= 12 ; i++){
            if(count != (_data.length) && _data.length  != 0 && _data[count].Month == i ){
                newDataObject.labels.push("Tháng " + _data[count].Month);
                newDataObject.data.push(_data[count].TotalPrice);
                count++;
            }
            else{
                newDataObject.labels.push("Tháng " + i);
                newDataObject.data.push(0);
            }
        }
    }
    else{
        var count = 0;
        for(var i = yearYear ; i <= currentYear ; i++){ // Thống kê theo các năm 
            if( count != (_data.length) && _data.length  != 0 && _data[count].Year == i ){
                newDataObject.labels.push(_data[count].Year);
                newDataObject.data.push(_data[count].TotalPrice);
                count++;
            }
            else{
                newDataObject.labels.push(i);
                newDataObject.data.push(0);
            }
        }
    }
   

    const data = {
        labels: newDataObject.labels,
        data: newDataObject.data,
        year1: yearMonth,
        year2: yearYear
    };
    res.json(data);
}


//client
exports.getStatisticalData_client = async (req, res, next) => {
    const month = req.query.month;
    const year = req.query.year;
    // Lấy dữ liệu 
    const _data = await Order_Detail.getStatisticalData_client(month, year)

    const newDataObject = {
        labels: [],
        data: []
    };
    _data.forEach(item => {
        newDataObject.labels.push(item.ProductName);
        newDataObject.data.push(item.Total);
    });

    // Kiểm tra xem tháng và năm có vượt quá thời điểm hiện tại hay không
    // const currentYear = new Date().getFullYear();
    // const currentMonth = new Date().getMonth() + 1;

    // if (year > currentYear || (year == currentYear && month > currentMonth)) {
    //     res.render("errorPage", {
    //         layout: 'customer',
    //         admin: false,
    //         error: "Lỗi: Thời gian vượt quá thời điểm hiện tại",
    //         Username: req.Username,
    //     });
    // }
    const data = {
        labels: newDataObject.labels,
        data: newDataObject.data,
        month: month,
        year: year,
    };
    res.json(data);
}
exports.gethotBook_client = async (req, res, next) => {
    res.render("hotBookPageClient", {
        layout: 'customer',
        admin: false,
        title: "Sản phẩm bán chạy",
        Username: req.Username,
    });
}



exports.getSearchBook_client = async (req, res, next) => {
    const { keyword = "", minPrice = "", maxPrice = "", category = 0,type = "ProductName", page = 1, limit = 4 } = req.query;
    const categories = await Categories.getAll();
    const _books = await Book.search({
        Min: minPrice,
        Max: maxPrice,
        Keyword: keyword,
        Page: page,
        Limit: limit,
        Type: type,
        Category: category
    });
    
    const _preview = await Book.search({
        Min: minPrice,
        Max: maxPrice,
        Keyword: keyword,
        Page: 1,
        Limit: limit,
        Type: type,
        Category: category
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

    if (_preview[0]?.Total/4 < req.query.page - 1)
    {
        res.redirect(`/?page=1&keyword=${keyword}&type=${type}`);
        
    }
    else
    {
        res.render("searchBookClient", {
            layout: 'customer',
            title: "Tìm kiếm sản phẩm",
            Username: req.Username,
            _books,
            pages,
            categories,
            Username: req.Username,
            MinPrice: minPrice,
            MaxPrice: maxPrice,
            keyword: keyword,
            genre: type,
        })
    }
    
}


exports.deleteProduct = async (req, res, next) => {
    const Id = req.query.ID;
    try {
      await Book.deleteProductByProductID(Id);
      res.status(200).json({ message: 'Dữ liệu đã được xóa thành công!' });
    } catch (error) {
      res.status(500).json({ message: 'Có lỗi xảy ra khi xóa dữ liệu.' });
    } finally {
    }
  }
