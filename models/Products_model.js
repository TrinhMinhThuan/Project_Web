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
        let pool = await sql.connect(databaseConnection);
        if(options.Keyword == ""){
           let Products = await pool.request()
          .input("Offset", sql.Int, (options.Page - 1) * options.Limit)
          .input("Limit", sql.Int, options.Limit)
          .query(
            `SELECT * , count(*) over() as Total  FROM Products  
            ORDER BY ProductID
            OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY `
          );
          return Products.recordsets[0];
        }
        else{
            let query = ``;
            if(options.Type == "CategoryName"){
                query = query + `SELECT * , count(*) over() as Total  FROM Products join Categories on Products.CategoryID = Categories.CategoryID WHERE Categories.${options.Type} LIKE @Keyword 
                ORDER BY Products.ProductId
                OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY`
            }
            else{
                query = query + `SELECT * , count(*) over() as Total  FROM Products join Categories on Products.CategoryID = Categories.CategoryID WHERE Products.${options.Type} LIKE @Keyword 
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
}