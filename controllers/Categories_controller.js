const Categories = require('../models/Categories_model');
const Products = require('../models/Products_model');

exports.getSearchCategories = async (req, res, next) => {
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
    layout: 'admin',
    title: "Danh sách danh mục",
    Username: req.Username,
    admin: true,
    _Categories,
    pages,
    ValueName: keyCategoryName,
  });
}

exports.deleteCategories = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    await Categories.delete(categoryId)
    await Products.deleteProductByCategoryID(categoryId)
    res.status(200).json({ message: 'Dữ liệu đã được xóa thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa dữ liệu.' });
  } finally {
  }
}

exports.addCategories = async (req, res, next) => {
  const { categoryID, importDate, categoryName } = req.query;
  // Check CategoryID
  if (categoryID !== undefined) {
    const checkID = await Categories.checkID(categoryID);
    if (checkID == true) {
      res.render("errorPage", {
        layout: 'admin',
        Username: req.Username,
        admin: true,
        error: "Đã tồn tại ID",
      });
      return;
    }
  }
  if (categoryID !== undefined && importDate !== undefined && categoryName !== undefined) {
    const temp = await Categories.add({
      ID: categoryID,
      Date: importDate,
      Name: categoryName
    });
    if (temp) {
      res.render("truePage", {
        layout: 'admin',
        Username: req.Username,
        admin: true,
        notification: "Thêm danh mục thành công",
      });
      return;
    }
    else {
      res.render("errorPage", {
        layout: 'admin',
        Username: req.Username,
        admin: true,
        error: "Thêm danh mục thất bại",
      });
    }
  } else {
    res.render("addCategoriesAdmin", {
      layout: 'admin',
      Username: req.Username,
      admin: true,
      title: "Thêm danh mục",
    });
  }
}


exports.editCategories = async (req, res, next) => {
  // Category cần edit
  const { categoryId } = req.params;
  const _Categories = await Categories.searchID(categoryId)
  const categoryid = _Categories.CategoryID;
  const categoryname = _Categories.CategoryName;
  //const categoryquantity = _Categories.CategoryQuantity;


  // Category edit
  const { categoryID, categoryName} = req.query;
 
  // Check CategoryID
  if (categoryID !== undefined && categoryID != categoryId) {
    const checkID = await Categories.checkID(categoryID);
    if (checkID == true) {
      res.render("errorPage", {
        layout: 'admin',
        error: "Đã tồn tại ID",
        Username: req.Username,
        admin: true,
      });
    }
  }
  if(categoryID == categoryId && categoryName == categoryname){
    res.render("errorPage", {
      layout: 'admin',
      admin: true,
      error: "Không có sự thay đổi",
      Username: req.Username,
    });
  }
  else if(categoryID !== undefined && categoryName !== undefined) {

    

    let query = `UPDATE Categories SET `;
    let checkdot = false;
    if (categoryID != categoryid) {
      query = query + `CategoryID = @categoryId `;
      checkdot = true;
    }
    if (categoryName != categoryname) {
      if (checkdot == true) query = query + `,`;
      query = query + `CategoryName = @categoryName `;
      checkdot = true;
    }
    // if (categoryQuantity != categoryquantity) {
    //   if (checkdot == true) query = query + `,`;
    //   query = query + `CategoryQuantity = @categoryQuantity `;
    //   checkdot = true;
    // }
    query = query + `Where CategoryID = ${categoryid}`;
    const temp = await Categories.edit({
      ID: categoryID,
      Name: categoryName,
      //Quantity: categoryQuantity,
      Query: query
    });
    if (temp) {
      // Thay đổi CategoryID trong product nếu có sự thay đổi
      if(categoryID != categoryId){
        const check = await Products.EditCategoryID(categoryId, categoryID)
      }
      res.render("truePage", {
        layout: 'admin',
        admin: true,
        notification: "Chỉnh sửa thành công",
        Username: req.Username,
      });
    }
    else {
      res.render("errorPage", {
        layout: 'admin',
        admin: true,
        error: "Chỉnh sửa thất bại",
        Username: req.Username,
      });
    }
  } else {
    res.render("editCategoriesAdmin", {
      layout: 'admin',
      title: "Chỉnh sửa danh mục",
      Username: req.Username,
      admin: true,
      CategoryID: categoryid,
      CategoryName: categoryname,
      //CategoryQuantity: categoryquantity,
    });
  }
}
