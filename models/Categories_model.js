const sql = require("mssql");

const databaseConnection = require('../utils/database');

module.exports = class Categories 
{
    constructor(CategoryID, CategoryName, CategoryQuantity)
    {
        this.CategoryID =CategoryID;
        this.CategoryName = CategoryName; 
        this.CategoryQuantity = CategoryQuantity;
    }
    static async getAll()
    {
        let pool = await sql.connect(databaseConnection);
        let Categories = await pool.request().query("SELECT * FROM Categories");
        return Categories.recordset;
    }
    // Search theo tên và phân trang
    static async search(options)
    {
        let pool = await sql.connect(databaseConnection);
        if(options.Keyword == ""){
           let Categories = await pool.request()
          .input("Offset", sql.Int, (options.Page - 1) * options.Limit)
          .input("Limit", sql.Int, options.Limit)
          .query(
            `SELECT * , count(*) over() as Total  FROM Categories  
            ORDER BY CategoryID
            OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY `
          );
          return Categories.recordsets[0];
        }
        else{
            let Categories = await pool.request()
            .input("Keyword", sql.NVarChar, `%${options.Keyword}%`)
            .input("Offset", sql.Int, (options.Page - 1) * options.Limit)
            .input("Limit", sql.Int, options.Limit)
            .query(
                `SELECT * , count(*) over() as Total  FROM Categories WHERE CategoryName LIKE @Keyword 
                ORDER BY CategoryID
                OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY `
            );
           return Categories.recordsets[0];
        }
    }
    // Search theo id
    static async searchID(CategoryID)
    {
        let pool = await sql.connect(databaseConnection);
        let Categories = await pool.request()
        .input('categoryId', sql.Int, CategoryID)
        .query(`SELECT * FROM Categories WHERE CategoryID = @categoryId`);
        return Categories.recordset[0];
    }


    static async delete(categoryId){
        let pool = await sql.connect(databaseConnection);
        let deletee = await pool.request()
        .input('categoryId', sql.Int, categoryId)
        .query('DELETE FROM Categories WHERE CategoryID = @categoryId');
    }

    static async add(Category){
        let pool = await sql.connect(databaseConnection);
        let add = await pool.request()
        .input('categoryId', sql.Int, Category.ID)
        .input('categoryName', sql.NVarChar, `${Category.Name}`)
        .query('INSERT INTO Categories (CategoryID, CategoryName, CategoryQuantity) VALUES (@categoryId, @categoryName, 0);');
        if (add.rowsAffected[0] > 0) {
            return true;
        } else {
            return false;
        }
    }

    static async edit(Category){
        let pool = await sql.connect(databaseConnection);
        let add = await pool.request()
        .input('categoryId', sql.Int, Category.ID)
        .input('categoryName', sql.NVarChar, `${Category.Name}`)
        .input('categoryQuantity', sql.Int, Category.Quantity)
        .query(`${Category.Query}`);
        if (add.rowsAffected[0] > 0) {
            return true;
        } else {
            return false;
        }
    }


    static async checkID(categoryId){
        let pool = await sql.connect(databaseConnection);
        let check = await pool.request()
        .input('categoryId', sql.Int, categoryId)
        .query('SELECT * FROM Categories WHERE CategoryID = @categoryId');

        if (check.recordset.length > 0) {
            return true; // Đã tồn tại id
        } else {
            return false; // Chưa tồn tại id có thể thêm vào
        }
    }
}