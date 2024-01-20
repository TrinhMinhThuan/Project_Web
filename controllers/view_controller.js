
const Product = require('../models/Users_model');
const Categories = require('../models/Categories_model');


exports.Login = async (req, res, next) =>
{
    const result = await Product.getAll();
    res.render("loginPage", {
        title: "Đăng nhập",
      });
}

exports.getSearchCategories = async (req,res,next) =>{
    const { keyCategoryName = "", page = 1, limit = 5 } = req.query;
    const _Categories = await Categories.search({
      Keyword: keyCategoryName,
      Page: page,
      Limit: limit,
    });
    const pages = Array.from(
      { length: Math.ceil(_Categories[0]?.Total / limit || 0) },
      (_, i) => i + 1
    );
    res.render("searchCategoriesAdmin", {
      title: "Quản lý danh mục", 
      _Categories,
      pages,
      ValueName: keyCategoryName,
    });
}

exports.deleteCategories = async (req,res,next) =>{
  const { categoryId } = req.params;
  try {
    await Categories.delete(categoryId)
    res.status(200).json({ message: 'Dữ liệu đã được xóa thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa dữ liệu.' });
  } finally {
  }
}









