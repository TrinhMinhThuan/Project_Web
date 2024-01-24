const sql = require("mssql");

const databaseConnection = require('../utils/database');

module.exports = class Book 
{
    constructor(ProductID, ProductName, CategoryID, StockQuantity, Author, PublishedYear, Image, Price)
    {
        this.ProductID =ProductID;
        this.ProductName = ProductName; 
        this.CategoryID = CategoryID;
        this.StockQuantity =StockQuantity;
        this.Author = Author; 
        this.CategoryID = CategoryID;
        this.PublishedYear =PublishedYear;
        this.Image = Image; 
        this.Price = Price;
    }
    static async getAll()
    {
        let pool = await sql.connect(databaseConnection);
        let books = await pool.request().query("SELECT * FROM Users");
        return books.recordset;
    }
    static async deleteProductByProductID(ID)
    {
        let pool = await sql.connect(databaseConnection);
        let deletee = await pool.request()
        .input('Id', sql.Int, ID)
        .query('DELETE FROM Products WHERE ProductID = @Id');
        return deletee.rowsAffected[0];
    }
    static async deleteProductByCategoryID(ID)
    {
        let pool = await sql.connect(databaseConnection);
        let deletee = await pool.request()
        .input('Id', sql.Int, ID)
        .query('DELETE FROM Products WHERE CategoryID = @Id');
        return deletee.rowsAffected[0];
    }
    static async updateStockQuantityByProductID(ID, Quantity)
    {
        let pool = await sql.connect(databaseConnection);
        let product = await pool
            .request()
            .input('Quantity', sql.Int, Quantity)
            .input('ID', sql.Int, ID)
            .query("update Products set StockQuantity = StockQuantity + @Quantity WHERE ProductID = @ID");
        return product.rowsAffected[0];
    }
    static async getByProductID(proID)
    {
        let pool = await sql.connect(databaseConnection);
        let Products = await pool.request()
        .input('proID', sql.Int, proID)
        .query(`SELECT * FROM Products WHERE ProductID = @proID`);
        return Products.recordset[0];
    }
    // Search theo key và phân trang
    static async search(options)
    {
        
        let query = ``;
        if(options.Min != "" && options.Max != ""){
            query += `SELECT * , count(*) over() as Total  FROM Products where Price >= ${options.Min} and Price <= ${options.Max}
            ORDER BY ProductID
            OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY `
        }
        else{
            query += `SELECT * , count(*) over() as Total  FROM Products  
            ORDER BY ProductID
            OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY `
        }
        let pool = await sql.connect(databaseConnection);
        if(options.Keyword == "" && options.Category == 0){
           let Products = await pool.request()
          .input("Offset", sql.Int, (options.Page - 1) * options.Limit)
          .input("Limit", sql.Int, options.Limit)
          .query(
            query
          );
          return Products.recordsets[0];
        }
        else{
            let query = ``;
            if(options.Category == 0){
                
                query = query + `SELECT * , count(*) over() as Total  FROM Products
                WHERE Products.${options.Type} LIKE @Keyword 
                ORDER BY Products.ProductId
                OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY`
            }
            else{
                
                query = query + `SELECT * , count(*) over() as Total  FROM Products 
                WHERE Products.${options.Type} LIKE @Keyword AND Products.CategoryID = ${options.Category}
                ORDER BY Products.ProductId
                OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY`
            }
            let Products = await pool.request()
            .input("Keyword", sql.NVarChar, `%${options.Keyword}%`)
            .input("Offset", sql.Int, (options.Page - 1) * options.Limit)
            .input("Limit", sql.Int, options.Limit)
            .query(
                `${query}`
            );
           return Products.recordsets[0];
        }
    }
    static async checkID(productID){
        let pool = await sql.connect(databaseConnection);
        let check = await pool.request()
        .input("productID", sql.Int, productID)
        .query('SELECT * FROM Products WHERE ProductID = @productID');

        if (check.recordset.length > 0) {
            return true; // Đã tồn tại id
        } else {
            return false; // Chưa tồn tại id có thể thêm vào
        }
    }
    static async EditCategoryID(categoryid, newCategoryid){
        let pool = await sql.connect(databaseConnection);
        let check = await pool.request()
        .input("categoryid", sql.Int, categoryid)
        .input("newcategoryid",sql.Int,newCategoryid)
        .query(`UPDATE Products SET CategoryID = @newcategoryid where CategoryID = @categoryid `);
        if (check.rowsAffected[0] > 0) {
            return true;
        } else {
            return false;
        }
    }

    static async edit(product, newProduct){
        let pool = await sql.connect(databaseConnection);
        let query = `UPDATE Products SET `;
        let checkdot = false;
        
        if (product.ProductID != newProduct.newProductID) {
          query = query + `ProductID = @productid `;
          checkdot = true;
        }
        if (product.Image != newProduct.newImage) {
            if(checkdot) query = query + `,`;
            query = query + `Image = @image `;
            checkdot = true;
        }
        if (product.ProductName != newProduct.productName) {
            if(checkdot) query = query + `,`; 
            query = query + `ProductName = @productName `;
            checkdot = true;
        }
        if (product.CategoryID != newProduct.categoryId) {
            if(checkdot) query = query + `,`;
            query = query + `CategoryID = @categoryId `;
            checkdot = true;
        }
        if (product.StockQuantity != newProduct.stockquantity) {
            if(checkdot) query = query + `,`;
            query = query + `StockQuantity = @stockquantity `;
            checkdot = true;
        }
        if (product.Author != newProduct.author) {
            if(checkdot) query = query + `,`;
            query = query + `Author = @author `;
            checkdot = true;
        }
        if (product.PublishedYear != newProduct.publishedyear) {
            if(checkdot) query = query + `,`;
            query = query + `PublishedYear = @publishedyear `;
            checkdot = true;
        }
        if (product.Price != newProduct.price) {
            if(checkdot) query = query + `,`; 
            query = query + `Price = @price `;
            checkdot = true;
        }
        if(product.ProductID == newProduct.newProductID &&
            product.ProductName == newProduct.productName &&
            product.CategoryID == newProduct.categoryId &&
            product.Image == newProduct.newImage  &&
            product.StockQuantity == newProduct.stockquantity &&
            product.Author == newProduct.author &&
            product.PublishedYear == newProduct.publishedyear &&
            product.Price == newProduct.price
        ) return false;

        query = query + `Where ProductID = ${product.ProductID}`;
        let check = await pool.request()
        .input("productid", sql.Int, newProduct.newProductID)
        .input("image", sql.NVarChar, `${newProduct.newImage}`)
        .input("productName", sql.NVarChar, `${newProduct.productName}`)
        .input("categoryId", sql.Int, newProduct.categoryId)
        .input("stockquantity", sql.Int, newProduct.stockquantity)
        .input("author", sql.NVarChar, `${newProduct.author}`)
        .input("publishedyear", sql.Int, newProduct.publishedyear)
        .input("price", sql.Int, newProduct.price)
        .query(query);
        if (check.rowsAffected[0] > 0) {
            return true;
        } else {
            return false;
        }
    }
    static async add(newProduct){
        // let pool = await sql.connect(databaseConnection);
        // let add = await pool.request()
        // .input('categoryId', sql.Int, Category.ID)
        // .input('categoryName', sql.NVarChar, `${Category.Name}`)
        // .query('INSERT INTO Categories (CategoryID, CategoryName, CategoryQuantity) VALUES (@categoryId, @categoryName, 0);');
        // if (add.rowsAffected[0] > 0) {
        //     return true;
        // } else {
        //     return false;
        // }    

        let pool = await sql.connect(databaseConnection);
        let add = await pool.request()
        .input('productid', sql.Int, newProduct.newProductID)
        .input('image', sql.NVarChar, `${newProduct.newImage}`)
        .input('productName', sql.NVarChar, `${newProduct.productName}`)
        .input('categoryId', sql.Int, newProduct.categoryId)
        .input('stockquantity', sql.Int, newProduct.stockquantity)
        .input('author', sql.NVarChar, `${newProduct.author}`)
        .input('publishedyear', sql.Int, newProduct.publishedyear)
        .input('price', sql.Int, newProduct.price)
        .query(`INSERT INTO Products (ProductID, ProductName, CategoryID, StockQuantity, Author, PublishedYear, Image, Price) 
                VALUES (@productid, @productName, @categoryId, @stockquantity, @author, @publishedyear, @image, @price  )`)
        if (add.rowsAffected[0] > 0) {
            return true;
        } else {
            return false;
        }
    }

    
}